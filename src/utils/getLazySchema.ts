import {isLazySchema} from '../asserters'
import type {SanityType} from '../defs'

export function getLazySchema(schema: SanityType): SanityType {
  if (isLazySchema(schema)) {
    if ((schema as any)._cache === undefined) {
      ;(schema as any)._cache = schema.get()
    }
    return (schema as any)._cache
  }
  return schema
}
