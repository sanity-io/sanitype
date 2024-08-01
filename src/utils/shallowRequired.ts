import {isObjectSchema, isOptionalSchema} from '../asserters'
import {object} from '../creators'
import {
  type OutputOf,
  type SanityDocument,
  type SanityObject,
  type SanityObjectShape,
  type SanityObjectType,
  type _SanityDocument,
} from '../defs'
import {type SanityRequired} from './required'

export type RequiredShape<S> = S extends SanityObjectShape
  ? {
      [K in keyof S]: SanityRequired<S[K]>
    }
  : never

export type ShallowRequired<S extends SanityObject | SanityDocument> =
  S extends SanityObject<infer Shape>
    ? SanityObjectShape extends Shape
      ? SanityObjectType<Required<OutputOf<S>>>
      : SanityObject<RequiredShape<Shape>>
    : S extends _SanityDocument<infer Shape>
      ? SanityDocument<RequiredShape<Shape>>
      : never

export function shallowRequired<S extends SanityObject | SanityDocument>(
  schema: S,
): ShallowRequired<S> {
  if (isObjectSchema(schema)) {
    const requiredShape = Object.entries(schema.shape).map(
      ([key, propSchema]) => {
        return [
          key,
          isOptionalSchema(propSchema) ? propSchema.type : propSchema,
        ]
      },
    )
    return object(Object.fromEntries(requiredShape)) as any
  }
  throw new Error('Expected object schema')
}
