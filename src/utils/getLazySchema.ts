import {SanityType} from "../defs"
import {isLazySchema} from "../asserters"

export function getLazySchema(schema: SanityType): SanityType {
  if (isLazySchema(schema)) {
    if ((schema as any)._cache === undefined) {
      ;(schema as any)._cache = schema.get()
    }
    return (schema as any)._cache
  }
  return schema
}
