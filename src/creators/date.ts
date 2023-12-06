import {defineType} from '../helpers/defineType'
import type {SanityDate} from '../defs'

export function date(): SanityDate {
  return defineType({typeName: 'date'})
}
