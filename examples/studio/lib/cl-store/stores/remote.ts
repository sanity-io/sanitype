import type {RemoteDocumentStore} from '../types'
import type {SanityDocumentBase} from '@bjoerge/mutiny'

export function createRemoteDataStore() {
  const records: RemoteDocumentStore<SanityDocumentBase> = Object.create(null)

  return {
    set: (id: string, document: SanityDocumentBase | undefined) => {
      records[id] = document
    },
    get: (id: string) => records[id],
  }
}
