import {Builder} from './builder'
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

export class DocumentBuilder<
    Shape extends SanityObjectShape = SanityObjectShape,
    Output = UndefinedOptional<OutputFromShape<SanityDocumentShape & Shape>>,
  >
  extends Builder<Output>
  implements SanityDocument<Shape, Output>
{
  typeName = 'document' as const
  constructor(public shape: Shape) {
    super()
  }
}

export function document<Shape extends SanityObjectShape = SanityObjectShape>(
  def: SafeObject<Shape, '_id' | '_type'> & {
    _id?: SanityLiteral<string> | SanityString
    _type: SanityLiteral<string>
  },
) {
  return new DocumentBuilder(def)
}
