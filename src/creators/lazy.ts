import {defineType} from '../helpers/defineType'
import {type SanityAny, type SanityLazy} from '../defs'

export function lazy<T extends SanityAny>(getter: () => T): SanityLazy<T> {
  return defineType({typeName: 'lazy', get: getter})
}
