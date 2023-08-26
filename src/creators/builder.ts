import {parse, safeParse} from '../parse'
import type {ParseResult} from '../parse'
import type {
  OutputOf,
  SanityOptional,
  SanityType,
  UndefinedOptional,
} from '../defs'

export abstract class Builder<Output> implements SanityType {
  abstract typeName: string
  get output(): Output {
    throw new Error('This method is not defined runtime')
  }
  parse(input: unknown): Output {
    return parse(this, input)
  }

  safeParse(input: unknown): ParseResult<Output> {
    return safeParse(this, input)
  }

  optional() {
    return new OptionalBuilder(this)
  }
}

export class OptionalBuilder<
    Type extends SanityType,
    Output = UndefinedOptional<OutputOf<Type>> | undefined,
  >
  extends Builder<Output>
  implements SanityOptional<Type>
{
  typeName = 'optional' as const
  constructor(public type: Type) {
    super()
  }
}
