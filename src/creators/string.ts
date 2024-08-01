import {type SanityString} from '../defs'
import {defineType} from '../helpers/defineType'

export function string(): SanityString {
  return defineType({typeName: 'string'})
}
