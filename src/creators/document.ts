import {defineType} from '../helpers/defineType'
import {type SanityDocumentShape, documentBase} from '../shapeDefs'
import {type Format} from '../helpers/utilTypes'
import {
  type OutputFromShape,
  type SanityDocument,
  type SanityLiteral,
  type SanityObjectShape,
  type SanityString,
  type UndefinedOptional,
} from '../defs'
import {type SafeObject} from './object'

export function document<Shape extends SanityObjectShape = SanityObjectShape>(
  shape: SafeObject<Shape, '_id' | '_type'> & {
    _id?: SanityLiteral<string> | SanityString
    _type: SanityLiteral<string>
  },
): SanityDocument<
  Format<Shape & SanityDocumentShape>,
  UndefinedOptional<OutputFromShape<SanityDocumentShape & Shape>>
> {
  return defineType({
    typeName: 'document',
    shape: {...documentBase.shape, ...shape},
  }) as any
}
