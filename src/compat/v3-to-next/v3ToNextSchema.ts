import {
  type SanityTypedObject,
  array,
  block,
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
  union,
} from '../../'
import type {SanityType} from '../../'
import type * as v3 from '@sanity/types'

export type HoistedTypeRefs = {[name: string]: {ref: SanityType | null}}

function convertType(
  typeDef: v3.SchemaTypeDefinition,
  hoisted: HoistedTypeRefs,
): SanityType {
  if (isObjectDefinition(typeDef)) {
    return convertObject(typeDef, hoisted)
  }
  if (isArrayDefinition(typeDef)) {
    return convertArray(typeDef, hoisted)
  }
  if (isBlockDefinition(typeDef)) {
    return convertBlock(typeDef, hoisted)
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
    case 'datetime':
      return dateTime()
    case 'url':
      return string()
    case 'email':
      return string()
    case 'image':
      return image(
        convertFields((typeDef as v3.ImageDefinition).fields || [], hoisted),
      )
    case 'file':
      return file(
        convertFields((typeDef as v3.FileDefinition).fields || [], hoisted),
      )
  }
  throw new Error(`Unknown field type: ${typeDef.type}`)
}

function convertFields(fields: v3.FieldDefinition[], hoisted: HoistedTypeRefs) {
  return Object.fromEntries(
    fields.map((field): [string, SanityType] => {
      const {name, ...fieldType} = field
      return [
        field.name,
        convertType(fieldType as v3.SchemaTypeDefinition, hoisted),
      ]
    }),
  )
}

function convertDocument(
  type: v3.DocumentDefinition,
  hoisted: HoistedTypeRefs,
) {
  return document({
    _type: literal(type.name),
    ...convertFields(type.fields, hoisted),
  })
}

function convertObject(type: v3.ObjectDefinition, hoisted: HoistedTypeRefs) {
  return object({
    ...(type.name ? {_type: literal(type.name)} : {}),
    ...convertFields(type.fields, hoisted),
  })
}

function convertBlock(
  blockDefinition: v3.BlockDefinition,
  hoisted: HoistedTypeRefs,
) {
  const inlineTypes = (blockDefinition.of || []).map(
    annotation => convertArrayMember(annotation, hoisted) as SanityTypedObject,
  )
  const annotations = (blockDefinition.marks?.annotations || []).map(
    annotation => convertArrayMember(annotation, hoisted) as SanityTypedObject,
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

function convertArrayMember(ofType: v3.ArrayOfType, hoisted: HoistedTypeRefs) {
  return convertType(ofType as v3.SchemaTypeDefinition, hoisted)
}

function convertArray(type: v3.ArrayDefinition, hoisted: HoistedTypeRefs) {
  if (type.of.length === 1) {
    return array(convertArrayMember(type.of[0], hoisted) as any)
  }
  return array(union(type.of.map(of => convertArrayMember(of, hoisted) as any)))
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
      hoisted[name].ref = convertDocument(type, hoisted)
    }
    if (isObjectDefinition(type)) {
      hoisted[name].ref = convertObject(type, hoisted)
    }
  })

  return Object.entries(hoisted).map(([name, hoistedType]) => {
    if (!hoistedType.ref) {
      throw new Error(`Hoisted type not resolved: ${name}`)
    }
    return hoistedType.ref
  })
}
