import {
  SanityAny,
  SanityBoolean,
  SanityDiscriminatedUnion,
  SanityDocument,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityObjectLike,
  SanityOptional,
  SanityPrimitive,
  SanityPrimitiveArray,
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
export function isDiscriminatedUnionSchema(
  schema: SanityType,
): schema is SanityDiscriminatedUnion {
  return schema.typeName === "discriminatedUnion"
}
export function isObjectSchema(schema: SanityType): schema is SanityObject {
  return schema.typeName === "object"
}
export function isDocumentSchema(schema: SanityType): schema is SanityDocument {
  return schema.typeName === "document"
}
export function isReferenceSchema(
  schema: SanityType,
): schema is SanityReference<any> {
  return schema.typeName === "reference"
}
export function isLiteralSchema(schema: SanityType): schema is SanityLiteral {
  return schema.typeName === "literal"
}
export function isItemObjectArrayCompatible(
  elementSchema:
    | SanityObjectLike
    | SanityUnion<SanityObjectLike>
    | SanityPrimitive
    | SanityUnion<SanityPrimitive>,
): elementSchema is SanityObjectLike | SanityUnion<SanityObjectLike> {
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
export function isOptionalSchema(
  schema: SanityType,
): schema is SanityOptional<any> {
  return schema.typeName === "optional"
}
export function isObjectArraySchema(
  schema: SanityType,
): schema is SanityObjectArray {
  return schema.typeName === "objectArray"
}
export function isPrimitiveArraySchema(
  schema: SanityType,
): schema is SanityPrimitiveArray {
  return schema.typeName === "primitiveArray"
}
