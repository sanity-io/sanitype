import {document, object} from '../creators'
import type {ElementType, MergeObject} from '../helpers/utilTypes'
import type {SanityDocument, SanityObject} from '../defs'

export type PickShape<
  T extends SanityObject | SanityDocument,
  K extends Array<keyof T['shape']>,
> = T extends SanityObject
  ? SanityObject<MergeObject<Pick<T['shape'], ElementType<K>>>>
  : T extends SanityDocument
  ? SanityDocument<MergeObject<Pick<T['shape'], ElementType<K>>>>
  : never

export function pick<
  T extends SanityObject | SanityDocument,
  K extends Array<keyof T['shape']>,
>(type: T, keys: K): PickShape<T, K> {
  const shape = Object.fromEntries(
    Object.entries(type.shape).filter(([key]) => keys.includes(key)),
  )
  return (
    type.typeName === 'object' ? object(shape) : document(shape as any)
  ) as any
}