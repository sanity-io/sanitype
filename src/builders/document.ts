import {
  OutputFromShape,
  SanityDocument,
  SanityLiteral,
  SanityObjectShape,
  SanityString,
  UndefinedOptional,
} from "../defs.js"
import {Builder} from "./builder.js"
import {SafeObject} from "./object.js"
import {SanityDocumentShape} from "../shapeDefs.js"

/**
 * @internal
 */
class DocumentBuilder<
    Shape extends SanityObjectShape = SanityObjectShape,
    Output = UndefinedOptional<OutputFromShape<SanityDocumentShape & Shape>>,
  >
  extends Builder<Shape, Output>
  implements SanityDocument<Shape, Output>
{
  typeName = "document" as const
}

export function document<
  Shape extends SanityObjectShape = SanityObjectShape,
  Output = UndefinedOptional<OutputFromShape<Shape>>,
>(
  def: SafeObject<Shape, "_id" | "_type"> & {
    _id?: SanityLiteral<string> | SanityString
    _type: SanityLiteral<string>
  },
) {
  return new DocumentBuilder(def)
}
