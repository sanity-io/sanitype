import {
  isDocumentSchema,
  isObjectArraySchema,
  isObjectSchema,
  isObjectUnionSchema,
  isOptionalSchema,
} from '../asserters'
import {getInstanceName} from '../content-utils/getInstanceName'
import type {SanityType} from '../defs'

type Err<V> = {
  ok: false
  value: V
}
type Ok<V> = {
  ok: true
  value: V
}

export class StrictModeError extends Error {
  constructor(
    message: string,
    public duplicates: TypeNameInfo[],
  ) {
    super(message)
  }
}

export function strictMode<S extends SanityType>(schema: S): S {
  const res = safeStrictMode(schema)
  if (res.ok) {
    return res.value
  }
  throw new StrictModeError(res.value.message, res.value.duplicates)
}
export function safeStrictMode<S extends SanityType>(
  schema: S,
): Ok<S> | Err<{message: string; duplicates: TypeNameInfo[]}> {
  const res = collectTypeNames(schema)
  const duplicates = Object.values(res).filter(info => info.paths.length > 1)
  if (duplicates.length === 0) {
    return {ok: true, value: schema}
  }
  return {
    ok: false,
    value: {
      message: `GraphQL Strict Mode error: Duplicate named types found in schema: ${duplicates
        .map(
          dupe =>
            `Found object with _type: "${dupe.name}" at ${dupe.paths
              .map(p => (p.length === 0 ? '(root)' : p.join(' -> ')))
              .join(', ')}`,
        )
        .join('\n')}`,
      duplicates,
    },
  }
}

interface TypeNameInfo {
  name: string
  paths: string[][]
}
type CollectedTypeNameInfo = Record<string, TypeNameInfo>

function assignTypeInfo(
  target: CollectedTypeNameInfo,
  t2: CollectedTypeNameInfo,
) {
  for (const [typeName, info] of Object.entries(t2)) {
    if (!target[typeName]) {
      target[typeName] = info
    } else {
      target[typeName].paths.push(...info.paths)
    }
  }
}

export function collectTypeNames<S extends SanityType>(
  schema: S,
  path: string[] = [],
): Record<string, TypeNameInfo> {
  if (isOptionalSchema(schema)) {
    return collectTypeNames(schema.type)
  }
  if (isObjectSchema(schema) || isDocumentSchema(schema)) {
    const instanceName = getInstanceName(schema)

    const info: CollectedTypeNameInfo = {}
    if (instanceName) {
      info[instanceName] = {
        name: instanceName,
        paths: [path],
      }
    }
    for (const [key, valueSchema] of Object.entries(schema.shape)) {
      assignTypeInfo(info, collectTypeNames(valueSchema, [...path, key]))
    }
    return info
  }
  if (isObjectArraySchema(schema)) {
    return collectTypeNames(schema.element)
  }
  if (isObjectUnionSchema(schema)) {
    const info: CollectedTypeNameInfo = {}

    for (const unionSchema of schema.union) {
      const instanceName = getInstanceName(unionSchema)

      const nextPath = instanceName ? [...path, instanceName] : path
      assignTypeInfo(info, collectTypeNames(unionSchema, nextPath))
    }
    return info
  }
  return {}
}
