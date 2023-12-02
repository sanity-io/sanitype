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

export type OmitShape<
  T extends SanityObject | SanityDocument,
  K extends Array<keyof OutputOf<T>>,
> = T extends SanityObject<infer Shape>
  ? SanityObjectShape extends Shape
    ? SanityObjectType<Format<Omit<OutputOf<T>, ElementType<K>>>>
    : SanityObject<Format<Omit<Shape, ElementType<K>>>>
  : T extends SanityDocument<infer Shape>
    ? SanityObjectShape extends Shape
      ? SanityDocumentType<Format<Omit<OutputOf<T>, ElementType<K>>>>
      : SanityDocument<Format<Omit<Shape, ElementType<K>>>>
    : never

export function omit<
  T extends SanityObject | SanityDocument,
  K extends Array<keyof OutputOf<T>>,
>(type: T, keys: K): OmitShape<T, K> {
  const shape = Object.fromEntries(
    Object.entries(type.shape).filter(([key]) => !keys.includes(key)),
  )
  return (
    type.typeName === 'object' ? object(shape) : document(shape as any)
  ) as any
}
