import {
  isAssetSchema,
  isLiteralSchema,
  isNeverSchema,
  isObjectUnionSchema,
  isPrimitiveSchema,
  isPrimitiveUnionSchema,
  isReferenceSchema,
  isTypedObjectSchema,
} from '../asserters'
import {
  type SanityAsset,
  type SanityBlock,
  type SanityLiteral,
  type SanityNever,
  type SanityObjectUnion,
  type SanityPrimitive,
  type SanityPrimitiveUnion,
  type SanityReference,
  type SanityTypedObject,
} from '../defs'
import {defineType} from '../helpers/defineType'

export type FlattenUnionTypes<
  T extends
    | SanityNever
    | SanityTypedObject
    | SanityReference
    | SanityObjectUnion<any>
    | SanityBlock
    | SanityAsset,
> =
  T extends SanityObjectUnion<infer UnionTypes>
    ? UnionTypes extends SanityObjectUnion<any>
      ? FlattenUnionTypes<UnionTypes>
      : UnionTypes
    : T

export type FlattenPrimitiveUnionTypes<
  T extends
    | SanityPrimitive
    | SanityLiteral
    | SanityPrimitiveUnion<any>
    | SanityNever,
> =
  T extends SanityPrimitiveUnion<infer UnionTypes>
    ? UnionTypes extends SanityPrimitiveUnion<any>
      ? FlattenPrimitiveUnionTypes<UnionTypes>
      : UnionTypes
    : T

export function union<
  UnionTypes extends
    | SanityNever
    | SanityTypedObject
    | SanityReference
    | SanityBlock
    | SanityAsset
    | SanityObjectUnion<any>,
>(unionTypes: UnionTypes[]): SanityObjectUnion<FlattenUnionTypes<UnionTypes>>
export function union<
  UnionTypes extends
    | SanityNever
    | SanityPrimitive
    | SanityLiteral
    | SanityPrimitiveUnion<any>,
>(
  unionTypes: UnionTypes[],
): SanityPrimitiveUnion<FlattenPrimitiveUnionTypes<UnionTypes>>
export function union<
  UnionTypes extends
    | SanityNever
    | SanityTypedObject
    | SanityReference
    | SanityPrimitive
    | SanityBlock,
>(
  unionTypes: UnionTypes[],
): UnionTypes extends SanityPrimitive
  ? SanityPrimitiveUnion<UnionTypes>
  : UnionTypes extends
        | SanityTypedObject
        | SanityReference
        | SanityBlock
        | SanityNever
    ? SanityObjectUnion<UnionTypes>
    : never {
  if (
    unionTypes.every(
      schema =>
        isLiteralSchema(schema) ||
        isPrimitiveSchema(schema) ||
        isNeverSchema(schema) ||
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
        isReferenceSchema(schema) ||
        isNeverSchema(schema) ||
        isAssetSchema(schema),
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
