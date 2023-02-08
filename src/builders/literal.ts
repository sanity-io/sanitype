import {SanityLiteral, SanityNumber, SanityString} from "../defs.js"
import {Builder} from "./builder.js"

class LiteralBuilder<T extends string | number | boolean>
  extends Builder<T, T>
  implements SanityLiteral
{
  typeName = "literal" as const
}

export function literal<T extends string | number | boolean>(value: T) {
  return new LiteralBuilder(value)
}
