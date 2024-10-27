import {
  isObjectArraySchema,
  isObjectSchema,
  isObjectUnionSchema,
  isOptionalSchema,
} from '../asserters'
import {objectArray} from '../creators/array'
import {object} from '../creators/object'
import {optional} from '../creators/optional'
import {union} from '../creators/union'
import {
  type OutputOf,
  type SanityDocument,
  type SanityObject,
  type SanityObjectArray,
  type SanityObjectShape,
  type SanityObjectType,
  type SanityObjectUnion,
  type SanityOptional,
  type SanityType,
} from '../defs'
import {type Combine, type ExtendsNever} from '../helpers/utilTypes'

export type MaybeOptionalType<T extends SanityType> =
  T extends SanityOptional<any> ? T : SanityOptional<T>

export type PartialShape<
  S extends SanityObjectShape,
  Except extends keyof S = never,
> = {
  [K in keyof S]: ExtendsNever<Except> extends true
    ? MaybeOptionalType<DeepPartial<S[K]>>
    : K extends Except
      ? DeepPartial<S[K]>
      : MaybeOptionalType<DeepPartial<S[K]>>
}

export type DeepPartialPlain<T> = T extends {_type: string}
  ? Combine<
      {[P in '_type']: T['_type']},
      {
        [P in keyof T as P extends '_type' ? never : P]?: DeepPartialPlain<T[P]>
      }
    >
  : {[P in keyof T]?: DeepPartialPlain<T[P]>}

export type DeepPartialObject<S extends SanityObject | SanityDocument> =
  S extends SanityObject<infer Shape>
    ? SanityObjectShape extends Shape
      ? SanityObjectType<DeepPartialPlain<OutputOf<S>>>
      : SanityObject<PartialShape<Shape, '_type'>>
    : S extends SanityDocument<infer Shape>
      ? SanityDocument<PartialShape<Shape, '_type'>>
      : never

export type DeepPartial<S extends SanityType> =
  S extends SanityOptional<any>
    ? S
    : S extends SanityObject | SanityDocument
      ? DeepPartialObject<S>
      : S extends SanityObjectUnion<infer UnionTypes>
        ? SanityObjectUnion<DeepPartial<UnionTypes>>
        : S extends SanityObjectArray<infer ElementType>
          ? SanityObjectArray<DeepPartial<ElementType>>
          : S

export function deepPartial<S extends SanityType>(schema: S): DeepPartial<S> {
  if (isOptionalSchema(schema)) {
    return optional(deepPartial(schema.type)) as any
  }
  if (isObjectSchema(schema)) {
    const partialShape = Object.entries(schema.shape).map(
      ([key, propSchema]) => {
        return [
          key,
          key === '_type' ? propSchema : optional(deepPartial(propSchema)),
        ]
      },
    )
    return object(Object.fromEntries(partialShape)) as any
  }
  if (isObjectUnionSchema(schema)) {
    return union(
      schema.union.map(unionSchema => deepPartial(unionSchema)) as any,
    ) as any
  }
  if (isObjectArraySchema(schema)) {
    return objectArray(deepPartial(schema.element) as any) as any
  }
  return schema as any
}
