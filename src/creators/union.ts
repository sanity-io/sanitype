import {defineType} from '../utils/defineType'
import type {SanityType, SanityUnion} from '../defs'

export function union<Def extends SanityType>(
  unionTypes: Def[],
): SanityUnion<Def> {
  return defineType({typeName: 'union', union: unionTypes})
}
