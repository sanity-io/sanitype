import {type SanityNever} from '../defs'
import {defineType} from '../helpers/defineType'

export function never(): SanityNever {
  return defineType({typeName: 'never'})
}
