import {
  isDocumentSchema,
  isLiteralSchema,
  isObjectArraySchema,
  isObjectSchema,
  isOptionalSchema,
  isPrimitiveArraySchema,
  isPrimitiveSchema,
} from './asserters'
import {type SanityType} from './defs'

type TODO = unknown

export function serializeSchema(schema: SanityType): TODO {
  // these can be returned as-is
  if (isLiteralSchema(schema) || isPrimitiveSchema(schema)) {
    return schema
  }
  if (isOptionalSchema(schema)) {
    return {typeName: schema.typeName, type: serializeSchema(schema.type)}
  }
  if (isObjectSchema(schema) || isDocumentSchema(schema)) {
    return {
      typeName: schema.typeName,
      shape: Object.entries(schema.shape).map(([name, value]) => [
        name,
        serializeSchema(value),
      ]),
    }
  }

  if (isObjectArraySchema(schema) || isPrimitiveArraySchema(schema)) {
    return {
      typeName: schema.typeName,
      element: serializeSchema(schema.element),
    }
  }
  throw new Error(
    `Serializing schema type: "${schema.typeName}" not yet supported`,
  )
}
