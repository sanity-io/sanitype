import {
  LiteralKeyNames,
  LiteralKeys,
  OutputOf,
  SanityDiscriminatedUnion,
  SanityObject,
} from "../defs.js"
import {Builder} from "./builder.js"

export class DiscriminatedUnionBuilder<
    Def extends SanityObject = SanityObject,
    Discriminator extends keyof LiteralKeyNames<Def["def"]> = keyof LiteralKeyNames<
      Def["def"]
    >,
    Output = OutputOf<Def>,
  >
  extends Builder<Def[], Output>
  implements SanityDiscriminatedUnion<Def, Discriminator, Output>
{
  typeName = "discriminatedUnion" as const
  constructor(public discriminator: Discriminator, public def: Def[]) {
    super(def)
  }
}

export function discriminatedUnion<
  Def extends SanityObject = SanityObject,
  Discriminator extends keyof LiteralKeyNames<Def["def"]> = keyof LiteralKeyNames<
    Def["def"]
  >,
  Output = OutputOf<Def>,
>(discriminator: Discriminator, schemas: Def[]) {
  return new DiscriminatedUnionBuilder(discriminator, schemas)
}
