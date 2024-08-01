import {isOptionalSchema} from '../asserters'
import {type SanityOptional, type SanityType} from '../defs'

export type SanityRequired<S extends SanityType> =
  S extends SanityOptional<infer T> ? SanityRequired<T> : S
export function required<S extends SanityType>(schema: S): SanityRequired<S> {
  return isOptionalSchema(schema) ? required(schema.type) : (schema as any)
}
