import type {SanityFormDef} from './types'
import type {SanityType} from '../defs'

export function defineForm<S extends SanityType>(
  type: S,
  form: SanityFormDef<S>,
) {
  return form
}
