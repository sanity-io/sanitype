import {literal} from '../creators'
import {omit} from './omit'
import {extend} from './extend'
import type {Extends} from './extend'
import type {SanityDocument, SanityLiteral, SanityObject} from '../defs'

export function rename<
  const T extends SanityObject | SanityDocument,
  const K extends string,
>(type: T, newName: K): Extends<T, {_type: SanityLiteral<K>}> {
  return extend(omit(type, ['_type']) as any, {_type: literal(newName)}) as any
}
