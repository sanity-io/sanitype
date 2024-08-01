import {defineType} from '../helpers/defineType'
import {type SanityDateTime} from '../defs'

export function dateTime(): SanityDateTime {
  return defineType({typeName: 'datetime'})
}
