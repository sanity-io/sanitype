import {literal} from '../creators'
import {
  type SanityDocument,
  type SanityLiteral,
  type SanityObject,
} from '../defs'
import {omit} from './omit'
import {type Extends, extend} from './extend'

export function rename<
  const T extends SanityObject | SanityDocument,
  const K extends string,
>(type: T, newName: K): Extends<T, {_type: SanityLiteral<K>}> {
  return extend(omit(type, ['_type']) as any, {_type: literal(newName)}) as any
}
