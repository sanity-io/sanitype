import {deepPartial} from './utils/deepPartial'
import {document} from './creators'
import {required} from './utils/required'
import type {DeepPartial} from './utils/deepPartial'
import type {ArrayElement} from '@bjoerge/mutiny'
import type {SanityDocument} from './defs'
import type {RequiredShape} from './utils/shallowRequired'

export const STORED_KEYS = [
  '_type',
  '_id',
  '_createdAt',
  '_updatedAt',
  '_rev',
] as const
export type StoredKeys = ArrayElement<typeof STORED_KEYS>

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
