import {referenceBase} from '../shapeDefs'
import {defineType} from '../helpers/defineType'
import type {SanityDocumentValue} from '../shapeDefs'
import type {SanityReference, SanityType} from '../defs'

export function reference<RefType extends SanityType<SanityDocumentValue>>(
  to: RefType,
): SanityReference<RefType> {
  return defineType({
    typeName: 'reference',
    referenceType: to,
    shape: referenceBase.shape,
  })
}
