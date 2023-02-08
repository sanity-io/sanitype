import {OutputOf, SanityType, SanityUnion} from "../defs.js"
import {Builder} from "./builder.js"

export class UnionBuilder<Def extends SanityType, Output = OutputOf<Def>>
  extends Builder<Def[], Output>
  implements SanityUnion<Def>
{
  typeName = "union" as const
}

export function union<Def extends SanityType>(schemas: Def[]) {
  return new UnionBuilder(schemas)
}
