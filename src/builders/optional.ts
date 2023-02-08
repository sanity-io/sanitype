import {OutputOf, SanityOptional, SanityType, UndefinedOptional,} from "../defs.js"
import {parse} from "../parse.js"

export class OptionalBuilder<
  Def extends SanityType,
  Output = UndefinedOptional<OutputOf<Def>> | undefined,
> implements SanityOptional<Def>
{
  typeName = "optional" as const
  constructor(public def: Def) {}
  parse(input: unknown): Output {
    return parse(this, input)
  }
  optional() {
    return this
  }

  get output(): Output {
    throw new Error("This method is not defined runtime")
  }
}

export function optional<
  Def extends SanityType,
  Output = UndefinedOptional<OutputOf<Def>> | undefined,
>(def: Def) {
  return new OptionalBuilder(def)
}
