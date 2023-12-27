import {
  type SanityTypedObject,
  array,
  block,
  boolean,
  date,
  dateTime,
  document,
  file,
  geopoint,
  image,
  literal,
  number,
  object,
  optional,
  referenceBase,
  slug,
  string,
  union,
} from '../../'
import {
  collectValidationRules,
  isOptional,
} from './utils/collectValidationRules'
import type {SanityType} from '../../'
import type * as v3 from '@sanity/types'

export type HoistedTypeRefs = {[name: string]: {ref: SanityType | null}}

function convertType(
  typeDef: v3.SchemaTypeDefinition,
  hoisted: HoistedTypeRefs,
  schema: v3.SchemaTypeDefinition[],
): SanityType {
  if (isObjectDefinition(typeDef)) {
    return convertObject(typeDef, hoisted, schema)
  }
  if (isArrayDefinition(typeDef)) {
    return convertArray(typeDef, hoisted, schema)
  }
  if (isBlockDefinition(typeDef)) {
    return convertBlock(typeDef, hoisted, schema)
  }

  const alias = schema.find(type => type.name === typeDef.type)

  if (alias) {
    return convertType(alias, hoisted, schema)
  }

  switch (typeDef.type) {
    case 'string':
      return string()
    case 'number':
      return number()
    case 'boolean':
      return boolean()
    case 'date':
      return date()
    case 'slug':
      return slug
    case 'geopoint':
      return geopoint
    case 'datetime':
      return dateTime()
    case 'url':
      return string()
    case 'text':
      return string()
    case 'email':
      return string()
    case 'image':
      return image(
        convertFields(
          (typeDef as v3.ImageDefinition).fields || [],
          hoisted,
          schema,
        ),
      )
    case 'file':
      return file(
        convertFields(
          (typeDef as v3.FileDefinition).fields || [],
          hoisted,
          schema,
        ),
      )
    case 'reference':
      // todo: support reference to other types
      return referenceBase
  }
  throw new Error(`Unknown field type: ${typeDef.type}`)
}

function convertFields(
  fields: v3.FieldDefinition[],
  hoisted: HoistedTypeRefs,
  schema: v3.SchemaTypeDefinition[],
) {
  return Object.fromEntries(
    fields.map((field): [string, SanityType] => {
      const {name, ...fieldType} = field

      const convertedType = convertType(
        fieldType as v3.SchemaTypeDefinition,
        hoisted,
        schema,
      )
      const rules = collectValidationRules(fieldType as v3.SchemaTypeDefinition)

      return [
        field.name,
        isOptional(rules) ? optional(convertedType) : convertedType,
      ]
    }),
  )
}

function convertDocument(
  type: v3.DocumentDefinition,
  hoisted: HoistedTypeRefs,
  schema: v3.SchemaTypeDefinition[],
) {
  return document({
    _type: literal(type.name),
    ...convertFields(type.fields, hoisted, schema),
  })
}

function convertObject(
  type: v3.ObjectDefinition,
  hoisted: HoistedTypeRefs,
  schema: v3.SchemaTypeDefinition[],
) {
  return object({
    ...(type.name ? {_type: literal(type.name)} : {}),
    ...convertFields(type.fields, hoisted, schema),
  })
}

function convertBlock(
  blockDefinition: v3.BlockDefinition,
  hoisted: HoistedTypeRefs,
  schema: v3.SchemaTypeDefinition[],
) {
  const inlineTypes = (blockDefinition.of || []).map(
    annotation =>
      convertArrayMember(annotation, hoisted, schema) as SanityTypedObject,
  )
  const annotations = (blockDefinition.marks?.annotations || []).map(
    annotation =>
      convertArrayMember(annotation, hoisted, schema) as SanityTypedObject,
  )
  const decorators = (blockDefinition.marks?.decorators || []).map(decorator =>
    literal(decorator.value),
  )
  const lists = (blockDefinition.lists || []).map(listType =>
    literal(listType.value),
  )
  const styles = (blockDefinition.styles || []).map(style =>
    literal(style.value),
  )
  return block({
    ...(blockDefinition.name ? {_type: literal(blockDefinition.name)} : {}),
    annotations,
    decorators,
    inlineTypes,
    lists,
    styles,
  })
}

function convertArrayMember(
  ofType: v3.ArrayOfType,
  hoisted: HoistedTypeRefs,
  schema: v3.SchemaTypeDefinition[],
) {
  return convertType(ofType as v3.SchemaTypeDefinition, hoisted, schema)
}

function convertArray(
  type: v3.ArrayDefinition,
  hoisted: HoistedTypeRefs,
  schema: v3.SchemaTypeDefinition[],
) {
  if (type.of.length === 1) {
    return array(convertArrayMember(type.of[0], hoisted, schema) as any)
  }
  return array(
    union(type.of.map(of => convertArrayMember(of, hoisted, schema) as any)),
  )
}

function isDocumentDefinition(
  type: v3.SchemaTypeDefinition,
): type is v3.DocumentDefinition {
  return type.type === 'document'
}

function isObjectDefinition(
  type: v3.SchemaTypeDefinition,
): type is v3.ObjectDefinition {
  return type.type === 'object'
}

function isArrayDefinition(
  type: v3.SchemaTypeDefinition,
): type is v3.ArrayDefinition {
  return type.type === 'array'
}

function isBlockDefinition(
  type: v3.SchemaTypeDefinition,
): type is v3.BlockDefinition {
  return type.type === 'block'
}

export function v3ToNextSchema(
  v3Schema: v3.SchemaTypeDefinition[],
): SanityType[] {
  const hoisted: HoistedTypeRefs = {}
  v3Schema.forEach(type => {
    hoisted[type.name] = {ref: null}
  })

  v3Schema.forEach(type => {
    const name = type.name
    if (isDocumentDefinition(type)) {
      hoisted[name].ref = convertDocument(type, hoisted, v3Schema)
    }
    if (isObjectDefinition(type)) {
      hoisted[name].ref = convertObject(type, hoisted, v3Schema)
    }
    if (isArrayDefinition(type)) {
      hoisted[name].ref = convertArray(type, hoisted, v3Schema)
    }
  })

  return Object.entries(hoisted).map(([name, hoistedType]) => {
    if (!hoistedType.ref) {
      throw new Error(`Hoisted type not resolved: ${name}`)
    }
    return hoistedType.ref
  })
}
