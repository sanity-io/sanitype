import {type SanityBoolean} from '../defs'
import {defineType} from '../helpers/defineType'

export function boolean(): SanityBoolean {
  return defineType({typeName: 'boolean'})
}
