import {defineType} from '../helpers/defineType'
import {
  isLiteralSchema,
  isObjectUnionSchema,
  isPrimitiveSchema,
  isPrimitiveUnionSchema,
  isReferenceSchema,
  isTypedObjectSchema,
} from '../asserters'
import type {
  SanityBlock,
  SanityLiteral,
  SanityObjectUnion,
  SanityPrimitive,
  SanityPrimitiveUnion,
  SanityReference,
  SanityTypedObject,
} from '../defs'

export type FlattenUnionTypes<
  T extends
    | SanityTypedObject
    | SanityReference
    | SanityObjectUnion<any>
    | SanityBlock,
> = T extends SanityObjectUnion<infer UnionTypes>
  ? UnionTypes extends SanityObjectUnion<any>
    ? FlattenUnionTypes<UnionTypes>
    : UnionTypes
  : T

export type FlattenPrimitiveUnionTypes<
  T extends SanityPrimitive | SanityLiteral | SanityPrimitiveUnion<any>,
> = T extends SanityPrimitiveUnion<infer UnionTypes>
  ? UnionTypes extends SanityPrimitiveUnion<any>
    ? FlattenPrimitiveUnionTypes<UnionTypes>
    : UnionTypes
  : T

export function union<
  UnionTypes extends
    | SanityTypedObject
    | SanityReference
    | SanityBlock
    | SanityObjectUnion<any>,
>(unionTypes: UnionTypes[]): SanityObjectUnion<FlattenUnionTypes<UnionTypes>>
export function union<
  UnionTypes extends
    | SanityPrimitive
    | SanityLiteral
    | SanityPrimitiveUnion<any>,
>(
  unionTypes: UnionTypes[],
): SanityPrimitiveUnion<FlattenPrimitiveUnionTypes<UnionTypes>>
export function union<
  UnionTypes extends
    | SanityTypedObject
    | SanityReference
    | SanityPrimitive
    | SanityBlock,
>(
  unionTypes: UnionTypes[],
): UnionTypes extends SanityPrimitive
  ? SanityPrimitiveUnion<UnionTypes>
  : UnionTypes extends SanityTypedObject | SanityReference | SanityBlock
    ? SanityObjectUnion<UnionTypes>
    : never {
  if (
    unionTypes.every(
      schema =>
        isLiteralSchema(schema) ||
        isPrimitiveSchema(schema) ||
        isPrimitiveUnionSchema(schema),
    )
  ) {
    return defineType({typeName: 'primitiveUnion', union: unionTypes}) as any
  }

  if (
    unionTypes.every(
      schema =>
        isTypedObjectSchema(schema) ||
        isObjectUnionSchema(schema) ||
        isReferenceSchema(schema),
    )
  ) {
    return defineType({
      typeName: 'union',
      union: unionTypes,
    }) as any
  }

  throw new Error(
    'Union types must either be of primitive values or typed objects',
  )
}
