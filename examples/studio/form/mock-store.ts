import {applyInIndex} from '@bjoerge/mutiny/_unstable_apply'
import {map, Subject} from 'rxjs'
import type {DocumentIndex} from '@bjoerge/mutiny/_unstable_apply'
import type {MutationEvent} from './types'
import type {Mutation, SanityDocument} from '@bjoerge/mutiny'

type UpdateEvent = {
  type: 'update'
  mutations: Mutation[]
}
const empty: DocumentIndex<any> = {}
export type Arrify<T> = (T extends (infer E)[] ? E : T)[]

export function arrify<T>(val: T): Arrify<T> {
  return Array.isArray(val) ? val : ([val] as any)
}

export const createStore = <Doc extends SanityDocument>(
  initialEntries?: Doc[],
) => {
  let index: DocumentIndex<Doc> =
    initialEntries && initialEntries?.length > 0
      ? initialEntries.reduce((acc, entry) => {
          acc[entry._id] = entry
          return acc
        }, empty)
      : empty

  const changeEvents = new Subject<UpdateEvent>()
  return {
    entries: () => Object.entries(index),
    get: (id: Doc['_id']) => index[id],
    apply: (_mutations: Mutation[] | Mutation) => {
      const mutations = arrify(_mutations)
      const nextIndex = applyInIndex(index, mutations) as DocumentIndex<Doc>
      if (nextIndex !== index) {
        index = nextIndex
        changeEvents.next({mutations, type: 'update'})
      }
    },
    listen: (id: Doc['_id']) =>
      changeEvents.asObservable().pipe(map(() => index[id])),
    changes: () => changeEvents.asObservable(),
  }
}
