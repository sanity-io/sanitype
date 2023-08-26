import {defineType} from '../utils/defineType'
import type {SanityDocumentShape} from '../shapeDefs'
import type {SafeObject} from './object'
import type {
  OutputFromShape,
  SanityDocument,
  SanityLiteral,
  SanityObjectShape,
  SanityString,
  UndefinedOptional,
} from '../defs'

export function document<
  Shape extends SanityObjectShape = SanityObjectShape,
  Output = UndefinedOptional<OutputFromShape<SanityDocumentShape & Shape>>,
>(
  def: SafeObject<Shape, '_id' | '_type'> & {
    _id?: SanityLiteral<string> | SanityString
    _type: SanityLiteral<string>
  },
): SanityDocument<Shape, Output> {
  return defineType({typeName: 'document', shape: def})
}
