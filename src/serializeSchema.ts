import {
  isDocumentSchema,
  isLiteralSchema,
  isObjectArraySchema,
  isObjectSchema,
  isOptionalSchema,
  isPrimitiveArraySchema,
  isPrimitiveSchema,
} from './asserters'
import {type SanityType} from './defs'

type TODO = unknown

export function serializeSchema(schema: SanityType): TODO {
  // these can be returned as-is
  if (isLiteralSchema(schema) || isPrimitiveSchema(schema)) {
    return schema
  }
  if (isOptionalSchema(schema)) {
    return {typeName: schema.typeName, type: serializeSchema(schema.type)}
  }
  if (isObjectSchema(schema) || isDocumentSchema(schema)) {
    const [systemAttrs, attrs] = partition(
      Object.entries(schema.shape),
      ([attr]) => attr.startsWith('_'),
    )
    return {
      typeName: schema.typeName,
      shape: [...systemAttrs, ...attrs].map(([name, value]) => [
        name,
        serializeSchema(value),
      ]),
    }
  }

  if (isObjectArraySchema(schema) || isPrimitiveArraySchema(schema)) {
    return {
      typeName: schema.typeName,
      element: serializeSchema(schema.element),
    }
  }
  throw new Error(
    `Serializing schema type: "${schema.typeName}" not yet supported`,
  )
}

function partition<T>(arr: T[], predicate: (value: T) => boolean): [T[], T[]] {
  const trueList: T[] = []
  const falseList: T[] = []
  arr.forEach((element: T) => {
    const list = predicate(element) ? trueList : falseList
    list.push(element)
  })
  return [trueList, falseList]
}
