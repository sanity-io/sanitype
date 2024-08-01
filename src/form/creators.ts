import {type SanityType} from '../defs'
import {type SanityFormDef} from './types'

export function defineForm<S extends SanityType>(
  type: S,
  form: SanityFormDef<S>,
) {
  return form
}
