import {SanityLiteral} from "../defs"
import {Builder} from "./builder"

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
