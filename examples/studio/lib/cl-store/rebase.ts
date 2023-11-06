import {getAtPath} from '@bjoerge/mutiny/path'
import {getMutationDocumentId} from './utils/getMutationDocumentId'
import {applyAll} from './apply'
import {compactDMPSetPatches} from './optimizations/squashNodePatches'

import type {NodePatch, SanityDocumentBase} from '@bjoerge/mutiny'

import type {PendingTransaction} from './types'

export function rebase(
  documentId: string,
  oldBase: SanityDocumentBase | undefined,
  newBase: SanityDocumentBase | undefined,
  outbox: PendingTransaction[],
): [newOutBox: PendingTransaction[], newLocal: SanityDocumentBase | undefined] {
  // 1. get the dmpified mutations from the outbox based on the old base
  // 2. apply those to the new base
  // 3. convert those back into set patches based on the new base
  let edge = oldBase
  const dmpForOldBase = outbox.map((transaction): PendingTransaction => {
    const mutations = transaction.mutations.flatMap(mut => {
      if (getMutationDocumentId(mut) !== documentId) {
        return []
      }
      const before = edge
      edge = applyAll(edge, [mut])
      if (!before) {
        return mut
      }
      if (mut.type !== 'patch') {
        return mut
      }
      return {
        ...mut,
        patches: compactDMPSetPatches(before, mut.patches as NodePatch[]),
      }
    })
    return {...transaction, mutations}
  })

  let newBaseWithDMPForOldBaseApplied: SanityDocumentBase | undefined
  // NOTE: It might not be possible to apply them - if so, we fall back to applying the pending changes
  try {
    newBaseWithDMPForOldBaseApplied = applyAll(
      newBase,
      dmpForOldBase.flatMap(t => t.mutations),
    )
  } catch (err) {
    // console.error(err)
    return [
      outbox,
      applyAll(
        newBase,
        outbox.flatMap(t => t.mutations),
      ),
    ]
  }

  const newOutbox = outbox.map((transaction): PendingTransaction => {
    // update all set patches to set to the current value
    return {
      ...transaction,
      mutations: transaction.mutations.map(mut => {
        if (mut.type !== 'patch' || getMutationDocumentId(mut) !== documentId) {
          return mut
        }
        return {
          ...mut,
          patches: mut.patches.map(patch => {
            if (patch.op.type !== 'set') {
              return patch
            }
            return {
              ...patch,
              op: {
                ...patch.op,
                value: getAtPath(patch.path, newBaseWithDMPForOldBaseApplied),
              },
            }
          }),
        }
      }),
    }
  })
  return [newOutbox, newBaseWithDMPForOldBaseApplied]
}
