import {Builder} from './builder'
import type {OutputOf, SanityAny, SanityLazy} from '../defs'

export class LazyBuilder<T extends SanityAny>
  extends Builder<OutputOf<T>>
  implements SanityLazy<T>
{
  typeName = 'lazy' as const

  constructor(public get: () => T) {
    super()
  }
}

export function lazy<T extends SanityAny>(creator: () => T) {
  return new LazyBuilder<T>(creator)
}
