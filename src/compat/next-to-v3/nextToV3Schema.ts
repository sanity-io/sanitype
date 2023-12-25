import {
  isAssetSchema,
  isBlockSchema,
  isBooleanSchema,
  isDateSchema,
  isDateTimeSchema,
  isLiteralSchema,
  isNumberSchema,
  isObjectArraySchema,
  isObjectLikeSchema,
  isObjectSchema,
  isObjectUnionSchema,
  isPrimitiveArraySchema,
  isPrimitiveUnionSchema,
  isReferenceSchema,
  isStringSchema,
} from '../../asserters'
import type {
  SanityAny,
  SanityAsset,
  SanityBlock,
  SanityDocument,
  SanityObjectArray,
  SanityObjectLike,
  SanityObjectUnion,
} from '../../defs'

type SanityV3SchemaType = any

export function nextToV3Schema<S extends SanityDocument>(
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
  if (isAssetSchema(schema)) {
    return assetToV3Schema(schema, hoisted)
  }
  if (isBlockSchema(schema)) {
    return blockToV3Schema(schema, hoisted)
  }
  if (isPrimitiveUnionSchema(schema)) {
    // we don't support this currently in v3, so fallback to the first type
    return convertItem(schema.union[0], hoisted)
  }
  if (isObjectLikeSchema(schema)) {
    return objectToV3Schema(schema, hoisted)
  }
  if (isLiteralSchema(schema)) {
    return {
      type: typeof schema.value,
      options: {
        list: [schema.value],
      },
    }
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
  throw new Error(`Unsupported schema type ${schema.typeName}}`)
}

function convertField<S extends SanityAny>(
  fieldName: string,
  schema: S,
  hoisted: Map<string, SanityV3SchemaType[]>,
) {
  if (isObjectSchema(schema)) {
    return {...objectToV3Schema(schema, hoisted), name: fieldName}
  }
  if (isLiteralSchema(schema)) {
    return {
      name: fieldName,
      type: typeof schema.value,
      options: {
        list: [schema.value],
      },
    }
  }
  if (isReferenceSchema(schema)) {
    throw new Error('References not implemented.')
  }
  if (isAssetSchema(schema)) {
    return {...assetToV3Schema(schema, hoisted), name: fieldName}
  }
  if (isDateTimeSchema(schema)) {
    return {name: fieldName, type: 'datetime'}
  }
  if (isDateSchema(schema)) {
    return {name: fieldName, type: 'date'}
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
      of: isObjectUnionSchema(schema.element)
        ? schema.element.union.map(u => convertItem(u, hoisted))
        : [convertItem(schema.element, hoisted)],
    }
  }
  return []
}

export function objectToV3Schema<S extends SanityObjectLike>(
  schema: S,
  hoisted: Map<string, SanityV3SchemaType[]>,
): SanityV3SchemaType {
  const typeLiteral = schema.shape._type

  const typeName =
    typeLiteral && isLiteralSchema(typeLiteral) ? typeLiteral.value : undefined

  return {
    type: schema.typeName,
    name: typeName,
    fields: Object.entries(schema.shape)
      .filter(([fieldName]) => !fieldName.startsWith('_'))
      .flatMap(([fieldName, field]) => convertField(fieldName, field, hoisted)),
  }
}

export function blockToV3Schema<S extends SanityBlock>(
  schema: S,
  hoisted: Map<string, SanityV3SchemaType[]>,
): SanityV3SchemaType {
  const typeLiteral = schema.shape._type

  const typeName =
    typeLiteral && isLiteralSchema(typeLiteral) ? typeLiteral.value : undefined

  const {children} = schema.shape
  return {
    type: 'block',
    name: typeName,
    of: (
      (children as SanityObjectArray).element as SanityObjectUnion
    ).union.map(u => convertItem(u, hoisted)),
  }
}

export function assetToV3Schema<S extends SanityAsset>(
  schema: S,
  hoisted: Map<string, SanityV3SchemaType[]>,
): SanityV3SchemaType {
  const systemFieldNames = ['asset']

  return objectToV3Schema(
    {
      ...schema,
      shape: Object.fromEntries(
        Object.entries(schema.shape).filter(
          ([fieldName]) => !systemFieldNames.includes(fieldName),
        ),
      ),
    },
    hoisted,
  )
}
