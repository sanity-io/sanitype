import {type SanityDate} from '../defs'
import {defineType} from '../helpers/defineType'

export function date(): SanityDate {
  return defineType({typeName: 'date'})
}
