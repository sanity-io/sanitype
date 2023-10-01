import {document, object} from '../creators'
import type {ElementType, Format} from '../helpers/utilTypes'
import type {SanityDocument, SanityObject} from '../defs'

export type OmitShape<
  T extends SanityObject | SanityDocument,
  K extends Array<keyof T['shape']>,
> = T extends SanityObject
  ? SanityObject<Format<Omit<T['shape'], ElementType<K>>>>
  : T extends SanityDocument
  ? SanityDocument<Format<Omit<T['shape'], ElementType<K>>>>
  : never

export function omit<
  T extends SanityObject | SanityDocument,
  K extends Array<keyof T['shape']>,
>(type: T, keys: K): OmitShape<T, K> {
  const shape = Object.fromEntries(
    Object.entries(type.shape).filter(([key]) => !keys.includes(key)),
  )
  return (
    type.typeName === 'object' ? object(shape) : document(shape as any)
  ) as any
}
