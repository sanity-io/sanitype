import {defineType} from '../helpers/defineType'
import {type SanityNumber} from '../defs'

export function number(): SanityNumber {
  return defineType({typeName: 'number'})
}
