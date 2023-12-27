import {
  isObjectArraySchema,
  isObjectSchema,
  isObjectUnionSchema,
  isPrimitiveSchema,
} from '../../asserters'
import type {SanityType} from '../../defs'

type Path = (string | number)[]
type FindCommon = {
  paths: Path[]
  type: SanityType
}

export function findCommon(type: SanityType): FindCommon[] {
  const res = []
  for (const [t, paths] of findCommonType(
    type,
    new Map<SanityType, Path[]>(),
  )) {
    if (paths.length > 1) {
      res.push({type: t, paths})
    }
  }

  return res
}

export function findCommonType(
  type: SanityType,
  seen: Map<SanityType, Path[]>,
  path: Path = [],
): Map<SanityType, Path[]> {
  if (seen.has(type)) {
    seen.get(type)!.push(path)
  } else if (!isPrimitiveSchema(type)) {
    seen.set(type, [path])
  }
  if (isObjectSchema(type)) {
    Object.entries(type.shape).forEach(([fieldName, fieldType]) => {
      findCommonType(fieldType, seen, path.concat(fieldName))
    })
  }
  if (isObjectUnionSchema(type)) {
    type.union.forEach((unionType, index) => {
      findCommonType(unionType, seen, path.concat(index))
    })
  }
  if (isObjectArraySchema(type)) {
    findCommonType(type.element, seen, path)
  }
  return seen
}
