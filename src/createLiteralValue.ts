import {
  InferLiteralValue,
  SanityDocument,
  SanityLiteral,
  SanityObject,
  SanityType,
} from "./defs.js"
import {isDocumentSchema, isLiteralSchema, isObjectSchema} from "./asserters.js"
import {getLazySchema} from "./utils/getLazySchema.js"
import {isEmpty} from "./utils/isEmpty.js"

function canCreateLiteralFrom(
  schema: SanityType,
): schema is SanityLiteral | SanityDocument | SanityObject {
  return (
    isObjectSchema(schema) ||
    isDocumentSchema(schema) ||
    isLiteralSchema(schema)
  )
}

export function createLiteralValue<T extends SanityType>(
  _schema: T,
): InferLiteralValue<T> {
  const schema = getLazySchema(_schema)

  if (isObjectSchema(schema) || isDocumentSchema(schema)) {
    return createObject(schema) as any
  }
  if (isLiteralSchema(schema)) {
    return schema.def as any
  }
  throw new Error(`Cannot create literal value from "${schema.typeName}"`)
}
function createObject<S extends SanityObject | SanityDocument>(
  schema: S,
): InferLiteralValue<S> | undefined {
  const keys: string[] = Object.keys(schema.def)
  const value: Record<string, any> = {}
  keys.forEach(key => {
    const fieldSchema = schema.def[key]!
    if (canCreateLiteralFrom(fieldSchema)) {
      value[key] = createLiteralValue(fieldSchema)
    }
  })
  return isEmpty(value) ? undefined : (value as any)
}