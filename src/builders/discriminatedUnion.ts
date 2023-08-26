import {Builder} from './builder'
import type {
  LiteralKeyNames,
  OutputOf,
  SanityDiscriminatedUnion,
  SanityObject,
} from '../defs'

export class DiscriminatedUnionBuilder<
    ObjectType extends SanityObject = SanityObject,
    Discriminator extends keyof LiteralKeyNames<
      ObjectType['shape']
    > = keyof LiteralKeyNames<ObjectType['shape']>,
    Output = OutputOf<ObjectType>,
  >
  extends Builder<Output>
  implements SanityDiscriminatedUnion<ObjectType, Discriminator, Output>
{
  typeName = 'discriminatedUnion' as const
  constructor(
    public discriminator: Discriminator,
    public union: ObjectType[],
  ) {
    super()
  }
}

export function discriminatedUnion<
  ObjectType extends SanityObject = SanityObject,
  Discriminator extends keyof LiteralKeyNames<
    ObjectType['shape']
  > = keyof LiteralKeyNames<ObjectType['shape']>,
  Output = OutputOf<ObjectType>,
>(discriminator: Discriminator, schemas: ObjectType[]) {
  return new DiscriminatedUnionBuilder(discriminator, schemas)
}
