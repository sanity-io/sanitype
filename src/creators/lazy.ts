import {type SanityAny, type SanityLazy} from '../defs'
import {defineType} from '../helpers/defineType'

export function lazy<T extends SanityAny>(getter: () => T): SanityLazy<T> {
  return defineType({typeName: 'lazy', get: getter})
}
