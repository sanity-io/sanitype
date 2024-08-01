import {defineType} from '../helpers/defineType'
import {type SanityLiteral} from '../defs'

export function literal<T extends string | number | boolean>(
  value: T,
): SanityLiteral<T> {
  return defineType({typeName: 'literal', value: value})
}
