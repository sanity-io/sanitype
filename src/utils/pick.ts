import {document, object} from '../creators'
import type {
  OutputOf,
  SanityDocument,
  SanityDocumentType,
  SanityObject,
  SanityObjectShape,
  SanityObjectType,
} from '../defs'
import type {ElementType, Format} from '../helpers/utilTypes'

export type PickShape<
  T extends SanityObject | SanityDocument,
  K extends Array<keyof OutputOf<T>>,
> = T extends SanityObject<infer Shape>
  ? SanityObjectShape extends Shape
    ? SanityObjectType<Format<Pick<OutputOf<T>, ElementType<K>>>>
    : SanityObject<Format<Pick<Shape, ElementType<K>>>>
  : T extends SanityDocument<infer Shape>
  ? SanityObjectShape extends Shape
    ? SanityDocumentType<Format<Pick<OutputOf<T>, ElementType<K>>>>
    : SanityDocument<Format<Pick<Shape, ElementType<K>>>>
  : never

export function pick<
  T extends SanityObject | SanityDocument,
  K extends Array<keyof OutputOf<T>>,
>(type: T, keys: K): PickShape<T, K> {
  const shape = Object.fromEntries(
    Object.entries(type.shape).filter(([key]) => keys.includes(key)),
  )
  return (
    type.typeName === 'object' ? object(shape) : document(shape as any)
  ) as any
}
