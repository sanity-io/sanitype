import {defineType} from '../utils/defineType'
import {documentBase} from '../shapeDefs'
import type {SanityDocumentShape} from '../shapeDefs'
import type {MergeObject} from '../utils/utilTypes'
import type {SafeObject} from './object'
import type {
  OutputFromShape,
  SanityDocument,
  SanityLiteral,
  SanityObjectShape,
  SanityString,
  UndefinedOptional,
} from '../defs'

export function document<Shape extends SanityObjectShape = SanityObjectShape>(
  shape: SafeObject<Shape, '_id' | '_type'> & {
    _id?: SanityLiteral<string> | SanityString
    _type: SanityLiteral<string>
  },
): SanityDocument<
  MergeObject<Shape & SanityDocumentShape>,
  UndefinedOptional<OutputFromShape<SanityDocumentShape & Shape>>
> {
  return defineType({
    typeName: 'document',
    shape: {...documentBase.shape, ...shape},
  }) as any
}
