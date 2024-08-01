import {type SanityOptional, type SanityType} from '../defs'
import {defineType} from '../helpers/defineType'

export function optional<T extends SanityType>(type: T): SanityOptional<T> {
  return defineType({typeName: 'optional', type: type})
}
