import camelCase from 'lodash/camelCase'
import {
  isDateSchema,
  isDateTimeSchema,
  isLiteralSchema,
  isObjectArraySchema,
  isObjectLikeSchema,
  isObjectUnionSchema,
  isOptionalSchema,
  isPrimitiveArraySchema,
  isPrimitiveSchema,
  isPrimitiveUnionSchema,
} from '../../asserters'
import {getInstanceName} from '../../content-utils/getInstanceName'
import * as creator from '../../creators'
import {findCommon} from './findCommon'
import type {
  SanityArray,
  SanityObjectArray,
  SanityObjectLike,
  SanityObjectUnion,
  SanityOptional,
  SanityPrimitiveArray,
  SanityPrimitiveUnion,
  SanityType,
} from '../../defs'
import type {FindCommon} from './findCommon'
import type {SourceFile} from './types'

type Serialized = {
  imports: Creator[]
  refs: string[]
  source: string
}

type Creator = (typeof creator)[keyof typeof creator]

function getNextValid(base: string, taken: Set<string>) {
  let i = 1
  let candidate = base
  while (taken.has(candidate)) {
    candidate = `${base}${i++}`
  }
  return candidate
}

function getAssignableName(common: FindCommon, taken: Set<string>) {
  const fieldnames = common.paths
    .map(p => p.at(-1))
    .filter((p): p is string => typeof p === 'string')
    .flat()

  const candidate =
    (isObjectLikeSchema(common.type) && getInstanceName(common.type)) ||
    fieldnames[0] ||
    common.type.typeName

  const name = getNextValid(candidate, taken)
  taken.add(name)
  return name
}

function toSource(exportName: string, serialized: Serialized) {
  const importsList = Array.from(new Set(serialized.imports))
    .toSorted()
    .map(c => c.name)
    .join(', ')

  const commonImports = Array.from(new Set(serialized.refs))
    .toSorted()
    .map(c => `import {${c}} from './${c}'`)

  const source = [
    `import {${importsList}} from 'sanitype'`,
    ...commonImports,
    `export const ${camelCase(exportName)} = ${serialized.source}`,
  ]
  return source.join('\n')
}
export function serialize(type: SanityType): SourceFile[] {
  const takenNames = new Set<string>()

  const typeName = getNextValid(
    (isObjectLikeSchema(type) && getInstanceName(type)) || type.typeName,
    takenNames,
  )

  const common = findCommon(type)
  const commonMap = new WeakMap<SanityType, string>()

  const serializedCommon = common.map(commonType => ({
    name: getAssignableName(commonType, takenNames),
    common: commonType,
    serialized: _serialize(commonType.type, commonMap),
  }))

  serializedCommon.map((entry, index) => {
    commonMap.set(entry.common.type, entry.name)
  })

  const serialized = _serialize(type, commonMap)

  return serializedCommon
    .map(({name, serialized: commonSerialized}) => ({
      name,
      source: toSource(name, commonSerialized),
    }))
    .concat({name: typeName, source: toSource(typeName, serialized)})
}

function _serialize(
  type: SanityType,
  commonMap: WeakMap<SanityType, string>,
): Serialized {
  if (isObjectLikeSchema(type)) {
    return serializeObjectType(type, commonMap)
  }
  if (isObjectArraySchema(type) || isPrimitiveArraySchema(type)) {
    return serializeArray(type, commonMap)
  }
  if (isObjectUnionSchema(type) || isPrimitiveUnionSchema(type)) {
    return serializeUnion(type, commonMap)
  }
  if (isLiteralSchema(type)) {
    return {
      refs: [],
      imports: [creator.literal],
      source: `literal(${JSON.stringify(type.value)})`,
    }
  }
  if (isOptionalSchema(type)) {
    return serializeOptional(type, commonMap)
  }
  if (isPrimitiveSchema(type) || isDateSchema(type) || isDateTimeSchema(type)) {
    const c = creator[type.typeName as keyof typeof creator]
    if (!c) throw new Error(`No creator for ${type.typeName}`)
    return {
      refs: [],
      imports: [c],
      source: `${type.typeName}()`,
    }
  }

  throw new Error(`Todo: ${type.typeName}`)
}

function serializeObjectType(
  type: SanityObjectLike,
  commonMap: WeakMap<SanityType, string>,
): Serialized {
  const serializedShape = Object.entries(type.shape).map(
    ([fieldName, fieldType]) => {
      const serialized = _serialize(fieldType, commonMap)
      const ref = commonMap.get(fieldType)
      return {
        imports: serialized.imports,
        field: fieldName,
        ref: commonMap.get(fieldType),
        source: ref || serialized.source,
      }
    },
  )

  const fieldsSource = serializedShape
    .map(({field, source}) => `${field}: ${source}`)
    .join(',\n')

  return {
    refs: serializedShape.flatMap(s => s.ref || []),
    imports: [creator.object, ...serializedShape.flatMap(s => s.imports)],
    source: `object({${fieldsSource}})`,
  }
}

function serializeArray(
  type: SanityObjectArray | SanityPrimitiveArray,
  commonMap: WeakMap<SanityType, string>,
): Serialized {
  const serializedElement = _serialize(type.element, commonMap)

  return {
    refs: serializedElement.refs,
    imports: [creator.array, ...serializedElement.imports],
    source: `array(${serializedElement.source})`,
  }
}

function serializeOptional(
  type: SanityOptional<SanityType>,
  commonMap: WeakMap<SanityType, string>,
): Serialized {
  const serializedInner = _serialize(type.type, commonMap)

  return {
    refs: serializedInner.refs,
    imports: [creator.optional, ...serializedInner.imports],
    source: `optional(${serializedInner.source})`,
  }
}

function serializeUnion(
  type: SanityObjectUnion | SanityPrimitiveUnion,
  commonMap: WeakMap<SanityType, string>,
): Serialized {
  const serializedUnionTypes = type.union.map(unionType => {
    const serialized = _serialize(unionType, commonMap)
    const ref = commonMap.get(unionType)
    return {
      imports: serialized.imports,
      ref: commonMap.get(unionType),
      source: ref || serialized.source,
    }
  })

  const unionsSource = serializedUnionTypes.map(u => u.source).join(',\n')

  return {
    refs: [...serializedUnionTypes.flatMap(s => s.ref || [])],
    imports: [creator.union, ...serializedUnionTypes.flatMap(s => s.imports)],
    source: `union([${unionsSource}])`,
  }
}
