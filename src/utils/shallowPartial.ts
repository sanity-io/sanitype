import {isObjectSchema, isOptionalSchema} from '../asserters'
import {object} from '../creators'
import type {
  OutputOf,
  SanityDocument,
  SanityDocumentType,
  SanityObject,
  SanityObjectShape,
  SanityObjectType,
} from '../defs'
import type {Combine} from '../helpers/utilTypes'
import type {MaybeOptionalType} from './deepPartial'

export type ShallowPartialShape<S> = S extends SanityObjectShape
  ? {
      [K in keyof S]: MaybeOptionalType<S[K]>
    }
  : never

export type ShallowPartial<S extends SanityObject | SanityDocument> =
  S extends SanityObject<infer Shape>
    ? SanityObjectShape extends Shape
      ? SanityObjectType<ShallowPartialPlain<OutputOf<S>>>
      : SanityObject<ShallowPartialShape<Shape>>
    : S extends SanityDocumentType<infer Shape>
      ? SanityDocument<ShallowPartialShape<Shape>>
      : never

export type ShallowPartialPlain<T> = T extends {_type: string}
  ? Combine<
      {[P in '_type']: T['_type']},
      {
        [P in keyof T as P extends '_type' ? never : P]?: T[P] | undefined
      }
    >
  : {[P in keyof T]?: T[P] | undefined}

export function shallowPartial<S extends SanityObject | SanityDocument>(
  schema: S,
): ShallowPartial<S> {
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
