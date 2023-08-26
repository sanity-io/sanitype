import {defineType} from '../utils/defineType'
import type {SanityNumber} from '../defs'

export function number(): SanityNumber {
  return defineType({typeName: 'number'})
}
