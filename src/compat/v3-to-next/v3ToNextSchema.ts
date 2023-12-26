import {defineType} from '@sanity/types'
import {
  boolean,
  date,
  dateTime,
  document,
  file,
  image,
  literal,
  number,
  object,
  string,
} from '../../'
import type {SanityType} from '../../'
import type * as v3 from '@sanity/types'

function convertField(field: v3.FieldDefinition): SanityType {
  switch (field.type) {
    case 'string':
      return string()
    case 'number':
      return number()
    case 'boolean':
      return boolean()
    case 'date':
      return date()
    case 'datetime':
      return dateTime()
    case 'url':
      return string()
    case 'email':
      return string()
    case 'image':
      return image({})
    case 'file':
      return file({})
    case 'object':
      return object(convertFields((field as v3.ObjectDefinition).fields))
    // case 'array':
    //   return array((field.of))
    // case 'reference':
    //   return reference(convertField(field.to))
    // case 'geopoint':
    //   return geopoint()
    // case 'block':
    //   return block()
    //   return object(convertFields(field.fields))
    // case 'reference':
    //   return reference(convertField(field.to))
    //   break
  }
  throw new Error(`Unknown field type: ${field.type}`)
}

function convertFields(fields: v3.FieldDefinition[]) {
  return Object.fromEntries(
    fields.map((field): [string, SanityType] => {
      return [field.name, convertField(field)]
    }),
  )
}

const t = defineType({
  type: 'document',
  name: 'human',
  fields: [{name: 'name', type: 'string'}],
})

function convertDocument(type: v3.DocumentDefinition) {
  return document({
    _type: literal(type.name),
    ...convertFields(type.fields),
  })
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

export function v3ToNextSchema(
  v3Schema: v3.SchemaTypeDefinition[],
): SanityType[] {
  return v3Schema.flatMap(type => {
    if (isDocumentDefinition(type)) {
      return convertDocument(type)
    }
    return []
  })
}
