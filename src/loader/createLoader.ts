import {type Infer, type SanityDocumentType, type SanityType} from '../defs'
import {type ElementType} from '../helpers/utilTypes'
import {type StoredDocument} from '../lifecycle'
import {type SanityDocumentValue} from '../shapeDefs'
import {createDocumentLoader, type MaybeLazy} from './createDocumentLoader'
import {
  createReferenceLoader,
  type InferReferenceType,
  type ReferenceWithOptionalRefType,
} from './createReferenceLoader'

export function createLoader(
  fetchImpl: (id: string, fieldSelection: string[]) => Promise<unknown>,
) {
  const loadDocument = createDocumentLoader(fetchImpl)
  const loadReference = createReferenceLoader(fetchImpl)

  function loadReferences<
    RefArray extends Array<
      ReferenceWithOptionalRefType<SanityType<SanityDocumentValue>>
    >,
  >(
    references: RefArray,
  ): Promise<StoredDocument<InferReferenceType<ElementType<RefArray>>>[]> {
    return Promise.all(references.map(loadReference)) as any
  }

  function loadDocuments<
    DocumentSchema extends SanityDocumentType<SanityDocumentValue>,
  >(
    schema: MaybeLazy<DocumentSchema>,
    ids: string[],
  ): Promise<Infer<DocumentSchema>[]> {
    return Promise.all(ids.map(id => loadDocument(schema, id)))
  }

  return {loadDocument, loadDocuments, loadReference, loadReferences}
}
