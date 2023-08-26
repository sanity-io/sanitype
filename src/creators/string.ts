import {defineType} from '../utils/defineType'
import type {SanityString} from '../defs'

export function string(): SanityString {
  return defineType({typeName: 'string'})
}
