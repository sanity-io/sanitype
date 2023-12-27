import {camelCase} from 'lodash'
import prettier from 'prettier'
import {
  isLiteralSchema,
  isObjectLikeSchema,
  isObjectSchema,
  isPrimitiveSchema,
} from '../asserters'
import * as creator from '../creators'
import {getInstanceName} from '../content-utils/getInstanceName'
import type {SanityObject, SanityType} from '../defs'

type Serialized = {
  imports: Set<Creator>
  source: string
}

function add<T>(set: Set<T>, value: T): Set<T> {
  set.add(value)
  return set
}
type Creator = (typeof creator)[keyof typeof creator]

export async function serializePretty(type: SanityType) {
  const {source, name} = serialize(type)
  return {
    name,
    source: await prettier.format(source, {
      semi: false,
      bracketSpacing: false,
      parser: 'typescript',
    }),
  }
}

export function serialize(type: SanityType) {
  const serialized = _serialize(type)
  const importsList = Array.from(serialized.imports)
    .map(c => c.name)
    .join(', ')

  const name = isObjectLikeSchema(type)
    ? getInstanceName(type)
    : `${type.typeName}Schema`
  const source = `import {${importsList}} from 'sanitype'\nexport const ${camelCase(
    name,
  )} = ${serialized.source}`

  return {
    name: camelCase(name),
    source,
  }
}

function _serialize(
  type: SanityType,
  imports: Set<Creator> = new Set(),
): Serialized {
  if (isObjectSchema(type)) {
    return serializeObject(type, imports)
  }
  if (isLiteralSchema(type)) {
    return {
      imports: add(imports, creator.literal),
      source: `literal(${JSON.stringify(type.value)})`,
    }
  }
  if (isPrimitiveSchema(type)) {
    return {
      imports: add(imports, creator.literal),
      source: `${type.typeName}()`,
    }
  }
  throw new Error(`Todo: ${type.typeName}`)
}

function serializeObject(
  type: SanityObject,
  imports: Set<Creator>,
): Serialized {
  imports.add(creator.object)

  const shape = Object.keys(type.shape)
    .map(key => {
      const field = type.shape[key]
      return `${key}: ${_serialize(field, imports).source}`
    })
    .join(',\n')
  return {
    imports,
    source: `object({${shape}})`,
  }
}
