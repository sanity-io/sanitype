import {parse} from "../parse.js"
import {
  InitialValue,
  OutputOf,
  SanityAny,
  SanityInitialValue,
  SanityOptional,
  SanityType,
  UndefinedOptional,
} from "../defs.js"

export abstract class Builder<Def, Output> {
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

  nullable() {
    return new NullableBuilder(this)
  }

  nullish() {
    return new NullableBuilder(this.optional())
  }

  initialValue<T extends Output>(value: T | Promise<T> | (() => Promise<T>)) {
    return new InitialValueBuilder(this, value)
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

export class NullableBuilder<
    Def extends SanityType,
    Output = UndefinedOptional<OutputOf<Def>> | null,
  >
  extends Builder<Def, Output>
  implements SanityOptional<Def>
{
  typeName = "optional" as const
  constructor(public def: Def) {
    super(def)
  }
}

export class InitialValueBuilder<T extends SanityAny>
  extends Builder<T, OutputOf<T>>
  implements SanityInitialValue<T>
{
  typeName = "initialValue" as const
  constructor(
    public readonly def: T,
    public readonly _initialValue: InitialValue<OutputOf<T>>,
  ) {
    super(def)
  }
}
