import {compactDMPSetPatches} from './squashNodePatches'
import type {
  Mutation,
  NodePatch,
  PatchMutation,
  SanityDocumentBase,
} from '@bjoerge/mutiny'
import type {PendingTransaction} from '../types'

interface DataStore {
  get: (id: string) => SanityDocumentBase | undefined
}
export function squashDMPStrings(
  remote: DataStore,
  transactions: PendingTransaction[],
): PendingTransaction[] {
  return transactions.map(
    (transaction: PendingTransaction): PendingTransaction => ({
      ...transaction,
      mutations: dmpIfyMutations(remote, transaction.mutations),
    }),
  )
}

export function dmpIfyMutations(
  store: DataStore,
  mutations: Mutation[],
): Mutation[] {
  return mutations.map((mutation, i) => {
    return mutation.type === 'patch'
      ? dmpifyPatchMutation(store.get(mutation.id), mutation)
      : mutation
  })
}

export function dmpIfyMutationsForDoc(
  base: SanityDocumentBase | undefined,
  mutations: Mutation[],
): Mutation[] {
  return mutations.map((mutation, i) => {
    return mutation.type === 'patch'
      ? dmpifyPatchMutation(base, mutation)
      : mutation
  })
}

export function dmpifyPatchMutation(
  base: SanityDocumentBase | undefined,
  mutation: PatchMutation,
): PatchMutation {
  if (!base) {
    return mutation
  }
  return {
    ...mutation,
    patches: compactDMPSetPatches(base, mutation.patches as NodePatch[]),
  }
}
