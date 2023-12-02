import {groupBy} from 'lodash'
import {chunkTransactions} from '../utils/chunkTransactions'
import {getMutationDocumentId} from '../utils/getMutationDocumentId'
import {takeUntilRight} from '../utils/arrayUtils'
import {squashNodePatches} from './squashNodePatches'
import type {Mutation, NodePatch} from '@bjoerge/mutiny'
import type {PendingTransaction} from '../types'

export function squashTransactions(
  transactions: PendingTransaction[],
): PendingTransaction[] {
  return chunkTransactions(transactions)
    .map(transaction => ({
      ...transaction,
      mutations: squashMutations(transaction.mutations),
    }))
    .map(transaction => ({
      ...transaction,
      mutations: transaction.mutations.map(mutation => {
        if (mutation.type !== 'patch') {
          return mutation
        }
        return {
          ...mutation,
          patches: squashNodePatches(mutation.patches as NodePatch[]),
        }
      }),
    }))
}

/*
 assumptions:
 the order documents appear with their mutations within the same transaction doesn't matter
 */
export function squashMutations(mutations: Mutation[]): Mutation[] {
  const byDocument = groupBy(mutations, getMutationDocumentId)
  return Object.values(byDocument).flatMap(documentMutations => {
    // these are the mutations that happens for the document with <id> within the same transactions
    return squashCreateIfNotExists(squashDelete(documentMutations))
      .flat()
      .reduce((acc: Mutation[], docMutation) => {
        const prev = acc[acc.length - 1]
        if ((!prev || prev.type === 'patch') && docMutation.type === 'patch') {
          return acc.slice(0, -1).concat({
            ...docMutation,
            patches: (prev?.patches || []).concat(docMutation.patches),
          })
        }
        return acc.concat(docMutation)
      }, [])
  })
}

/**
 * WARNING: This assumes that the mutations are only for a single document
 * @param mutations
 */
export function squashCreateIfNotExists(mutations: Mutation[]): Mutation[] {
  if (mutations.length === 0) {
    return mutations
  }

  return mutations.reduce((previousMuts: Mutation[], laterMut: Mutation) => {
    if (laterMut.type !== 'createIfNotExists') {
      previousMuts.push(laterMut)
      return previousMuts
    }
    const prev = takeUntilRight(previousMuts, m => m.type === 'delete')
    const precedent = prev.find(
      precedingPatch => precedingPatch.type === 'createIfNotExists',
    )
    if (precedent) {
      // we already have an identical patch earlier in the chain that voids this one
      return previousMuts
    }
    previousMuts.push(laterMut)
    return previousMuts
  }, [])
}

function squashDelete(mutations: Mutation[]): Mutation[] {
  if (mutations.length === 0) {
    return mutations
  }

  return mutations.reduce((previousMuts: Mutation[], laterMut: Mutation) => {
    if (laterMut.type === 'delete') {
      return [laterMut]
    }
    previousMuts.push(laterMut)
    return previousMuts
  }, [])
}
