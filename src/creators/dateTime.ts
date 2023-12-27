import {type SanityDateTime} from '../defs'
import {defineType} from '../helpers/defineType'

export function dateTime(): SanityDateTime {
  return defineType({typeName: 'dateTime'})
}
