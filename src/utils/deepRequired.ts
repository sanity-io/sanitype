import {
  isObjectArraySchema,
  isObjectSchema,
  isObjectUnionSchema,
  isOptionalSchema,
} from '../asserters'
import {object, objectArray, optional, union} from '../creators'
import type {
  OutputOf,
  SanityDocument,
  SanityObject,
  SanityObjectArray,
  SanityObjectShape,
  SanityObjectType,
  SanityObjectUnion,
  SanityOptional,
  SanityType,
} from '../defs'

export type RequiredShape<S> = S extends SanityObjectShape
  ? {
      [K in keyof S]: DeepRequired<S[K]>
    }
  : never

export type DeepRequiredPlain<T> = {
  [P in keyof T]-?: DeepRequiredPlain<T[P]>
}

export type DeepRequiredObject<S extends SanityObject | SanityDocument> =
  S extends SanityObject<infer Shape>
    ? SanityObjectShape extends Shape
      ? SanityObjectType<DeepRequiredPlain<OutputOf<S>>>
      : SanityObject<RequiredShape<Shape>>
    : S extends SanityDocument<infer Shape>
      ? SanityDocument<RequiredShape<Shape>>
      : never

export type DeepRequired<S extends SanityType> = S extends SanityOptional<
  infer T
>
  ? DeepRequired<T>
  : S extends SanityObject | SanityDocument
    ? DeepRequiredObject<S>
    : S extends SanityObjectUnion<infer UnionTypes>
      ? SanityObjectUnion<DeepRequired<UnionTypes>>
      : S extends SanityObjectArray<infer ElementType>
        ? SanityObjectArray<DeepRequired<ElementType>>
        : S

export function deepRequired<S extends SanityType>(schema: S): DeepRequired<S> {
  if (isOptionalSchema(schema)) {
    return optional(deepRequired(schema.type)) as any
  }
  if (isObjectSchema(schema)) {
    const requiredShape = Object.entries(schema.shape).map(
      ([key, propSchema]) => {
        return [
          key,
          isOptionalSchema(propSchema)
            ? deepRequired(propSchema.type)
            : propSchema,
        ]
      },
    )
    return object(Object.fromEntries(requiredShape)) as any
  }
  if (isObjectUnionSchema(schema)) {
    return union(
      schema.union.map(unionSchema => deepRequired(unionSchema)) as any,
    ) as any
  }
  if (isObjectArraySchema(schema)) {
    return objectArray(deepRequired(schema.element) as any) as any
  }
  return schema as any
}
