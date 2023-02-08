import {
  OutputFromShape,
  OutputOf,
  SanityAny,
  SanityObject,
  SanityObjectArray,
  SanityObjectLike,
  SanityObjectShape,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityUnion,
  UndefinedOptional,
} from "../defs.js"
import {Builder} from "./builder.js"
import {string} from "./string.js"
import {isItemObjectArrayCompatible, isUnionSchema} from "../asserters.js"
import {Combine} from "../utils.js"

type AddArrayKey<T> = Combine<T, {_key: string}>
type FlattenUnion<T extends SanityAny> = OutputOf<T>

function addKeyProperty<
  T extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(target: T): T {
  return isUnionSchema(target)
    ? {...target, def: target.def.map(addKeyProperty)}
    : {...target, def: {...target.def, _key: string()}}
}
class ObjectArrayBuilder<
    ElementType extends SanityObjectLike | SanityUnion<SanityObjectLike>,
    Output = AddArrayKey<OutputOf<ElementType>>[],
  >
  extends Builder<ElementType, Output>
  implements SanityObjectArray<ElementType, Output>
{
  typeName = "objectArray" as const
}
class PrimitiveArrayBuilder<
    ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive> =
      | SanityPrimitive
      | SanityUnion<SanityPrimitive>,
    Output = FlattenUnion<ElementType>[],
  >
  extends Builder<ElementType, Output>
  implements SanityPrimitiveArray<ElementType, Output>
{
  typeName = "primitiveArray" as const
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
