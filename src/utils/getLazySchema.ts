import {SanityType} from "../defs.js"

export function getLazySchema(schema: SanityType): SanityType {
  if (schema.typeName === "lazy") {
    if ((schema as any)._cache === undefined) {
      ;(schema as any)._cache = schema.def()
    }
    return (schema as any)._cache
  }
  return schema
}
