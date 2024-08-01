import {type SanityNumber} from '../defs'
import {defineType} from '../helpers/defineType'

export function number(): SanityNumber {
  return defineType({typeName: 'number'})
}
