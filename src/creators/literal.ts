import {type SanityLiteral} from '../defs'
import {defineType} from '../helpers/defineType'

export function literal<T extends string | number | boolean>(
  value: T,
): SanityLiteral<T> {
  return defineType({typeName: 'literal', value: value})
}
