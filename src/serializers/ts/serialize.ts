import {camelCase} from 'lodash'
import {
  isLiteralSchema,
  isObjectLikeSchema,
  isObjectSchema,
  isOptionalSchema,
  isPrimitiveSchema,
} from '../../asserters'
import * as creator from '../../creators'
import {getInstanceName} from '../../content-utils/getInstanceName'
import {findCommon} from './findCommon'
import type {FindCommon} from './findCommon'
import type {SourceFile} from './types'
import type {SanityObject, SanityType} from '../../defs'

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
  if (isObjectSchema(type)) {
    return serializeObjectType(type, commonMap)
  }
  if (isLiteralSchema(type)) {
    return {
      refs: [],
      imports: [creator.literal],
      source: `literal(${JSON.stringify(type.value)})`,
    }
  }
  if (isOptionalSchema(type) || isPrimitiveSchema(type)) {
    return {
      refs: [],
      imports: [creator[type.typeName as keyof typeof creator]],
      source: `${type.typeName}()`,
    }
  }
  throw new Error(`Todo: ${type.typeName}`)
}

function serializeObjectType(
  type: SanityObject,
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
    refs: [...serializedShape.flatMap(s => s.ref || [])],
    imports: [creator.object, ...serializedShape.flatMap(s => s.imports)],
    source: `object({${fieldsSource}})`,
  }
}
