import {OutputOf, SanityType, SanityUnion} from "../defs"
import {Builder} from "./builder"

export class UnionBuilder<Def extends SanityType, Output = OutputOf<Def>>
  extends Builder<Output>
  implements SanityUnion<Def>
{
  typeName = "union" as const

  constructor(public union: Def[]) {
    super()
  }
}

export function union<Def extends SanityType>(schemas: Def[]) {
  return new UnionBuilder(schemas)
}
