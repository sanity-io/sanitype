import {document} from './creators'
import {type SanityDocument} from './defs'
import {type ElementType} from './helpers/utilTypes'
import {type DeepPartial, deepPartial} from './utils/deepPartial'
import {required} from './utils/required'
import {type RequiredShape} from './utils/shallowRequired'

export const STORED_KEYS = [
  '_type',
  '_id',
  '_createdAt',
  '_updatedAt',
  '_rev',
] as const

export type StoredKeys = ElementType<typeof STORED_KEYS>

export type Stored<T extends SanityDocument<any>> =
  T extends SanityDocument<infer DocShape>
    ? SanityDocument<
        RequiredShape<Pick<DocShape, StoredKeys>> & Omit<DocShape, StoredKeys>
      >
    : never

export type Draft<T extends SanityDocument> = DeepPartial<T>

export function draft<T extends SanityDocument>(schema: T): Draft<T> {
  return deepPartial(schema)
}

export function stored<T extends SanityDocument>(schema: T): Stored<T> {
  const storedShape = Object.entries(schema.shape).map(([key, propSchema]) => {
    return [
      key,
      STORED_KEYS.includes(key as StoredKeys)
        ? required(propSchema)
        : propSchema,
    ]
  })
  return document(Object.fromEntries(storedShape)) as any
}
