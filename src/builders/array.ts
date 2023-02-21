import {
  AddArrayKey,
  OutputOf,
  SanityObjectArray,
  SanityObjectLike,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityUnion,
} from "../defs.js"
import {Builder} from "./builder.js"
import {string} from "./string.js"
import {isItemObjectArrayCompatible, isUnionSchema} from "../asserters.js"

function addKeyProperty<
  T extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(target: T): T {
  return isUnionSchema(target)
    ? {...target, union: target.union.map(addKeyProperty)}
    : {...target, shape: {...target.shape, _key: string()}}
}
class ObjectArrayBuilder<
    ElementType extends SanityObjectLike | SanityUnion<SanityObjectLike>,
    Output = AddArrayKey<OutputOf<ElementType>>[],
  >
  extends Builder<Output>
  implements SanityObjectArray<ElementType, Output>
{
  typeName = "objectArray" as const
  constructor(public element: ElementType) {
    super()
  }
}
class PrimitiveArrayBuilder<
    ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive> =
      | SanityPrimitive
      | SanityUnion<SanityPrimitive>,
    Output = OutputOf<ElementType>[],
  >
  extends Builder<Output>
  implements SanityPrimitiveArray<ElementType, Output>
{
  typeName = "primitiveArray" as const
  constructor(public element: ElementType) {
    super()
  }
}

export function objectArray<
  ElementType extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(elementSchema: ElementType): SanityObjectArray<ElementType> {
  return new ObjectArrayBuilder(addKeyProperty(elementSchema))
}

export function primitiveArray<
  ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive>,
>(elementSchema: ElementType): SanityPrimitiveArray<ElementType> {
  return new PrimitiveArrayBuilder(elementSchema)
}

export function array<
  Def extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(elementSchema: Def): SanityObjectArray<Def>
export function array<
  Def extends SanityPrimitive | SanityUnion<SanityPrimitive>,
>(elementSchema: Def): SanityPrimitiveArray<Def>
export function array(
  elementSchema:
    | SanityObjectLike
    | SanityUnion<SanityObjectLike>
    | SanityPrimitive
    | SanityUnion<SanityPrimitive>,
) {
  return isItemObjectArrayCompatible(elementSchema)
    ? objectArray(elementSchema)
    : primitiveArray(elementSchema)
}
