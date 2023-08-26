import {Builder} from './builder'
import type {OutputOf, SanityType, SanityUnion} from '../defs'

export class UnionBuilder<Def extends SanityType, Output = OutputOf<Def>>
  extends Builder<Output>
  implements SanityUnion<Def>
{
  typeName = 'union' as const

  // eslint-disable-next-line no-shadow
  constructor(public union: Def[]) {
    super()
  }
}

export function union<Def extends SanityType>(schemas: Def[]) {
  return new UnionBuilder(schemas)
}
