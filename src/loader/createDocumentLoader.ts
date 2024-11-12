import {isLazySchema} from '../asserters'
import {
  type Infer,
  type SanityDocumentType,
  type SanityLazy,
  type SanityType,
} from '../defs'
import {ParseError, safeParse} from '../parse'
import {type SanityDocumentValue} from '../shapeDefs'

export type MaybeLazy<T extends SanityType> = T | SanityLazy<T>

export function createSafeLoadDocument(
  fetch: (id: string, fieldSelection: string[]) => Promise<unknown>,
) {
  return function safeFetchDocument<
    DocumentSchema extends SanityDocumentType<SanityDocumentValue>,
  >(schema: MaybeLazy<DocumentSchema>, id: string) {
    const nonlazySchema = isLazySchema(schema) ? schema.get() : schema
    const fields = Object.keys(nonlazySchema)
    return fetch(id, fields).then(input => safeParse(nonlazySchema, input))
  }
}

export function createDocumentLoader(
  fetch: (id: string, fieldSelection: string[]) => Promise<unknown>,
) {
  const safeFetchDocument = createSafeLoadDocument(fetch)

  return function fetchDocument<
    DocumentSchema extends SanityDocumentType<SanityDocumentValue>,
  >(
    schema: MaybeLazy<DocumentSchema>,
    id: string,
  ): Promise<Infer<DocumentSchema>> {
    return safeFetchDocument(schema, id).then(result =>
      result.status === 'ok'
        ? result.value
        : Promise.reject(new ParseError(result.errors)),
    )
  }
}
