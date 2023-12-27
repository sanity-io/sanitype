import type * as classic from '@sanity/types'

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
import {
  type SanityAny,
  type SanityAsset,
  type SanityBlock,
  type SanityDocument,
  type SanityObjectArray,
  type SanityObjectLike,
  type SanityObjectUnion,
} from '../../defs'

export function toClassicSchema<S extends SanityDocument>(
  schema: S,
): classic.SchemaTypeDefinition[] {
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
  hoisted: Map<string, classic.SchemaTypeDefinition[]>,
): classic.ArrayOfType | classic.ArrayOfType[] {
  if (isAssetSchema(schema)) {
    return assetToClassicSchema(schema, hoisted) as classic.ArrayOfType
  }
  if (isBlockSchema(schema)) {
    return blockToClassicSchema(schema, hoisted) as classic.ArrayOfType
  }
  if (isPrimitiveUnionSchema(schema)) {
    // we don't support this currently in v3, so fallback to the first type
    return convertItem(schema.union[0], hoisted)
  }
  if (isObjectLikeSchema(schema)) {
    return objectToClassicSchema(schema, hoisted) as classic.ArrayOfType
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
  hoisted: Map<string, classic.SchemaTypeDefinition[]>,
): classic.FieldDefinition | classic.FieldDefinition[] {
  if (isObjectSchema(schema)) {
    return [{...objectToClassicSchema(schema, hoisted), name: fieldName}]
  }
  if (isLiteralSchema(schema)) {
    return [
      {
        name: fieldName,
        type: typeof schema.value,
        options: {
          list: [schema.value],
        },
      },
    ]
  }
  if (isReferenceSchema(schema)) {
    throw new Error('References not implemented.')
  }
  if (isAssetSchema(schema)) {
    return {...assetToClassicSchema(schema, hoisted), name: fieldName}
  }
  if (isDateTimeSchema(schema)) {
    return {name: fieldName, type: 'dateTime'}
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
    } as classic.FieldDefinition<'array'>
  }
  return []
}

export function objectToClassicSchema<S extends SanityObjectLike>(
  schema: S,
  hoisted: Map<string, classic.SchemaTypeDefinition[]>,
) {
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

export function blockToClassicSchema<S extends SanityBlock>(
  schema: S,
  hoisted: Map<string, classic.SchemaTypeDefinition[]>,
) {
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

export function assetToClassicSchema<S extends SanityAsset>(
  schema: S,
  hoisted: Map<string, classic.SchemaTypeDefinition[]>,
) {
  const systemFieldNames = ['asset']

  return objectToClassicSchema(
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
