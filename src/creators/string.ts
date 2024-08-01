import {defineType} from '../helpers/defineType'
import {type SanityString} from '../defs'

export function string(): SanityString {
  return defineType({typeName: 'string'})
}
