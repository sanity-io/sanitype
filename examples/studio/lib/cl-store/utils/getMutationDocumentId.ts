import type {Mutation} from '@bjoerge/mutiny'

export function getMutationDocumentId(mutation: Mutation): string {
  if (mutation.type === 'patch') {
    return mutation.id
  }
  if (mutation.type === 'create') {
    return mutation.document._id
  }
  if (mutation.type === 'delete') {
    return mutation.id
  }
  if (mutation.type === 'createIfNotExists') {
    return mutation.document._id
  }
  if (mutation.type === 'createOrReplace') {
    return mutation.document._id
  }
  throw new Error('Invalid mutation type')
}
