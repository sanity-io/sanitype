import {defineType} from '../helpers/defineType'
import {type SanityOptional, type SanityType} from '../defs'

export function optional<T extends SanityType>(type: T): SanityOptional<T> {
  return defineType({typeName: 'optional', type: type})
}
