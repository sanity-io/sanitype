import type {SanityFormDef} from './types'

export function defineForm<S extends SanityType>(form: SanityFormDef<S>) {
  return form
}

import type {SanityType} from '../defs'
