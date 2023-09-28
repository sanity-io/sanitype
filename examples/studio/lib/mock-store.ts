import {createStore as _createStore} from '@bjoerge/mutiny/_unstable_apply'
import {map, Subject} from 'rxjs'
import type {Mutation, SanityDocumentBase} from '@bjoerge/mutiny'

type UpdateEvent = {
  type: 'update'
  mutations: Mutation[]
}
export type Arrify<T> = (T extends (infer E)[] ? E : T)[]
export function arrify<T>(val: T): Arrify<T> {
  return Array.isArray(val) ? val : ([val] as any)
}

export const createStore = <Doc extends SanityDocumentBase>(
  initialEntries?: Doc[],
) => {
  const store = _createStore(initialEntries)

  const changeEvents = new Subject<UpdateEvent>()
  return {
    entries: store.entries,
    get: store.get,
    apply: (_mutations: Mutation[] | Mutation) => {
      const versionBefore = store.version
      store.apply(_mutations)
      if (versionBefore !== store.version) {
        changeEvents.next({mutations: arrify(_mutations), type: 'update'})
      }
    },
    listen: <Id extends string>(id: Id) =>
      changeEvents.asObservable().pipe(map(() => store.get(id))),
    changes: () => changeEvents.asObservable(),
  }
}
