import {
  isBooleanSchema,
  isLiteralSchema,
  isNumberSchema,
  isObjectArraySchema,
  isObjectSchema,
  isPrimitiveArraySchema,
  isStringSchema,
  isUnionSchema,
} from '../asserters'
import type {SanityAny, SanityDocument, SanityObject} from '../defs'

type SanityV3SchemaType = any

export function toV3Schema<S extends SanityDocument>(
  schema: S,
): SanityV3SchemaType[] {
  const typeLiteral = schema.shape._type

  if (
    !typeLiteral ||
    !isLiteralSchema(typeLiteral) ||
    typeof typeLiteral.value !== 'string'
  ) {
    throw new Error('Expected _type property of schema to be a string literal')
  }

  const hoisted = new Map()
  return [
    {
      type: 'document',
      name: typeLiteral.value,
      fields: Object.entries(schema.shape)
        .filter(([fieldName]) => !fieldName.startsWith('_'))
        .flatMap(([fieldName, field]) =>
          convertField(fieldName, field, hoisted),
        ),
    },
  ]
}

function convertItem<S extends SanityAny>(
  schema: S,
  hoisted: Map<string, SanityV3SchemaType[]>,
) {
  if (isObjectSchema(schema)) {
    return objectToV3Schema(schema, hoisted)
  }
  if (
    isStringSchema(schema) ||
    isBooleanSchema(schema) ||
    isNumberSchema(schema)
  ) {
    return {
      type: schema.typeName,
    }
  }
}

function convertField<S extends SanityAny>(
  fieldName: string,
  schema: S,
  hoisted: Map<string, SanityV3SchemaType[]>,
) {
  if (isObjectSchema(schema)) {
    return {...objectToV3Schema(schema, hoisted), name: fieldName}
  }
  if (
    isStringSchema(schema) ||
    isBooleanSchema(schema) ||
    isNumberSchema(schema)
  ) {
    return {
      name: fieldName,
      type: schema.typeName,
    }
  }
  if (isObjectArraySchema(schema) || isPrimitiveArraySchema(schema)) {
    return {
      name: fieldName,
      type: 'array',
      of: isUnionSchema(schema.element)
        ? schema.element.union.map(u => convertItem(u, hoisted))
        : [convertItem(schema.element, hoisted)],
    }
  }
  return []
}

export function objectToV3Schema<S extends SanityObject>(
  schema: S,
  hoisted: Map<string, SanityV3SchemaType[]>,
): SanityV3SchemaType {
  const typeLiteral = schema.shape._type

  const typeName =
    typeLiteral && isLiteralSchema(typeLiteral) ? typeLiteral.value : undefined

  return {
    type: 'object',
    name: typeName,
    fields: Object.entries(schema.shape)
      .filter(([fieldName]) => !fieldName.startsWith('_'))
      .flatMap(([fieldName, field]) => convertField(fieldName, field, hoisted)),
  }
}
