import {SanityLiteral} from "../defs.js"
import {Builder} from "./builder.js"

class LiteralBuilder<T extends string | number | boolean>
  extends Builder<T>
  implements SanityLiteral
{
  typeName = "literal" as const
  constructor(public value: T) {
    super()
  }
}

export function literal<T extends string | number | boolean>(value: T) {
  return new LiteralBuilder(value)
}
