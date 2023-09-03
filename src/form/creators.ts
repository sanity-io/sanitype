import type {SanityFormDef} from './types'
import type {SanityType} from '../defs'

export function form<T extends SanityType = SanityType>(def: SanityFormDef<T>) {
  return def
}
