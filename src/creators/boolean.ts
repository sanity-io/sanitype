import {defineType} from '../utils/defineType'
import type {SanityBoolean} from '../defs'

export function boolean(): SanityBoolean {
  return defineType({typeName: 'boolean'})
}
