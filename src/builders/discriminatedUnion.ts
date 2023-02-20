import {OutputOf, SanityDiscriminatedUnion, SanityObject} from "../defs.js"
import {Builder} from "./builder.js"

export class DiscriminatedUnionBuilder<
    Def extends SanityObject,
    Discriminator extends keyof OutputOf<Def>,
    Output extends OutputOf<Def> = OutputOf<Def>,
  >
  extends Builder<Def[], Output>
  implements SanityDiscriminatedUnion<Def, Discriminator>
{
  typeName = "discriminatedUnion" as const
  constructor(public discriminator: Discriminator, public def: Def[]) {
    super(def)
  }
}

export function discriminatedUnion<
  Def extends SanityObject,
  Discriminator extends keyof OutputOf<Def>,
>(discriminator: Discriminator, schemas: Def[]) {
  return new DiscriminatedUnionBuilder(discriminator, schemas)
}
