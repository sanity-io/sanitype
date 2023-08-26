import {defineType} from '../utils/defineType'
import type {
  LiteralKeyNames,
  OutputOf,
  SanityDiscriminatedUnion,
  SanityObject,
} from '../defs'

export function discriminatedUnion<
  ObjectType extends SanityObject = SanityObject,
  Discriminator extends keyof LiteralKeyNames<
    ObjectType['shape']
  > = keyof LiteralKeyNames<ObjectType['shape']>,
  Output = OutputOf<ObjectType>,
>(
  discriminator: Discriminator,
  union: ObjectType[],
): SanityDiscriminatedUnion<ObjectType, Discriminator, Output> {
  return defineType({typeName: 'discriminatedUnion', discriminator, union})
}
