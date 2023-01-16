import {
  SanityAny,
  SanityBoolean,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityPrimitive,
  SanityReference,
  SanityString,
  SanityType,
  SanityUnion,
} from "./defs.js"

export function isUnionSchema(
  schema: SanityType,
): schema is SanityUnion<SanityAny> {
  return schema.typeName === "union"
}
export function isObjectSchema(schema: SanityType): schema is SanityObject {
  return schema.typeName === "object"
}
export function isReferenceSchema(
  schema: SanityType,
): schema is SanityReference<any> {
  return (
    schema.typeName === "object" && (schema as any).referenceType !== undefined
  )
}
export function isLiteralSchema(schema: SanityType): schema is SanityLiteral {
  return schema.typeName === "literal"
}
export function isItemObjectArrayCompatible(
  elementSchema:
    | SanityObject
    | SanityUnion<SanityObject>
    | SanityPrimitive
    | SanityUnion<SanityPrimitive>,
): elementSchema is SanityObject | SanityUnion<SanityObject> {
  return (
    isObjectSchema(elementSchema) ||
    (isUnionSchema(elementSchema) &&
      !elementSchema.def.some(def => !isObjectSchema(def)))
  )
}

export function isStringSchema(schema: SanityType): schema is SanityString {
  return schema.typeName === "string"
}
export function isNumberSchema(schema: SanityType): schema is SanityNumber {
  return schema.typeName === "number"
}
export function isBooleanSchema(schema: SanityType): schema is SanityBoolean {
  return schema.typeName === "boolean"
}
export function isObjectArraySchema(
  schema: SanityType,
): schema is SanityObjectArray {
  return schema.typeName === "objectArray"
}
