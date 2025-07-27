import {type NumberConstraints, type SanityNumber} from '../defs'
import {defineType} from '../helpers/defineType'

export function number(constraints?: NumberConstraints): SanityNumber {
  return defineType({typeName: 'number', constraints})
}
