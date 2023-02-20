import {parse} from "../parse.js"
import {
  OutputOf,
  SanityOptional,
  SanityType,
  UndefinedOptional,
} from "../defs.js"

export abstract class Builder<Def, Output> implements SanityType {
  abstract typeName: string
  constructor(public def: Def) {}
  get output(): Output {
    throw new Error("This method is not defined runtime")
  }
  parse(input: unknown): Output {
    return parse(this, input)
  }

  optional() {
    return new OptionalBuilder(this)
  }
}

export class OptionalBuilder<
    Def extends SanityType,
    Output = UndefinedOptional<OutputOf<Def>> | undefined,
  >
  extends Builder<Def, Output>
  implements SanityOptional<Def>
{
  typeName = "optional" as const
  constructor(public def: Def) {
    super(def)
  }
}
