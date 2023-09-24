import {defineType} from '../helpers/defineType'
import type {SanityOptional, SanityType} from '../defs'

export function optional<T extends SanityType>(type: T): SanityOptional<T> {
  return defineType({typeName: 'optional', type: type})
}
