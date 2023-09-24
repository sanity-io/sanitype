import {defineType} from '../helpers/defineType'
import type {SanityBoolean} from '../defs'

export function boolean(): SanityBoolean {
  return defineType({typeName: 'boolean'})
}
