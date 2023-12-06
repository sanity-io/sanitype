import {
  SANITY_OBJECT_LIKE,
  type SanityBoolean,
  type SanityDocument,
  type SanityImage,
  type SanityLazy,
  type SanityLiteral,
  type SanityNumber,
  type SanityObject,
  type SanityObjectArray,
  type SanityObjectLike,
  type SanityObjectUnion,
  type SanityOptional,
  type SanityPrimitive,
  type SanityPrimitiveArray,
  type SanityPrimitiveUnion,
  type SanityReference,
  type SanityString,
  type SanityType,
  type SanityTypedObject,
} from './defs'

export function isObjectUnionSchema(
  schema: SanityType,
): schema is SanityObjectUnion {
  return schema.typeName === 'union'
}
export function isPrimitiveUnionSchema(
  schema: SanityType,
): schema is SanityPrimitiveUnion {
  return schema.typeName === 'primitiveUnion'
}
export function isObjectSchema(schema: SanityType): schema is SanityObject {
  return schema.typeName === 'object'
}
export function isObjectLikeSchema(
  schema: SanityType,
): schema is SanityObjectLike {
  return SANITY_OBJECT_LIKE.includes(schema.typeName)
}
export function isDocumentSchema(schema: SanityType): schema is SanityDocument {
  return schema.typeName === 'document'
}
export function isReferenceSchema(
  schema: SanityType,
): schema is SanityReference<any> {
  return schema.typeName === 'reference'
}
export function isLazySchema(schema: SanityType): schema is SanityLazy<any> {
  return schema.typeName === 'lazy'
}
export function isLiteralSchema(schema: SanityType): schema is SanityLiteral {
  return schema.typeName === 'literal'
}
export function isItemObjectArrayCompatible(
  elementSchema: SanityType,
): elementSchema is SanityObjectLike | SanityObjectUnion {
  return (
    isObjectSchema(elementSchema) ||
    (isObjectUnionSchema(elementSchema) &&
      elementSchema.union.every(def => isObjectSchema(def)))
  )
}

export function isStringSchema(schema: SanityType): schema is SanityString {
  return schema.typeName === 'string'
}
export function isNumberSchema(schema: SanityType): schema is SanityNumber {
  return schema.typeName === 'number'
}
export function isBooleanSchema(schema: SanityType): schema is SanityBoolean {
  return schema.typeName === 'boolean'
}
export function isOptionalSchema(
  schema: SanityType,
): schema is SanityOptional<any> {
  return schema.typeName === 'optional'
}
export function isObjectArraySchema(
  schema: SanityType,
): schema is SanityObjectArray {
  return schema.typeName === 'objectArray'
}
export function isPrimitiveSchema(
  schema: SanityType,
): schema is SanityPrimitive {
  return (
    isStringSchema(schema) || isBooleanSchema(schema) || isNumberSchema(schema)
  )
}

export function isTypedObjectSchema(
  schema: SanityType,
): schema is SanityTypedObject {
  return (
    isObjectSchema(schema) &&
    schema.shape._type &&
    isLiteralSchema(schema.shape._type) &&
    typeof schema.shape._type.value === 'string'
  )
}
export function isPrimitiveArraySchema(
  schema: SanityType,
): schema is SanityPrimitiveArray {
  return schema.typeName === 'primitiveArray'
}
