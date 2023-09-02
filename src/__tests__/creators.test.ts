import {describe, test} from 'vitest'

import {
  array,
  document,
  lazy,
  literal,
  number,
  object,
  objectArray,
  optional,
  primitiveArray,
  reference,
  string,
  union,
} from '../creators'
import {parse} from '../parse'
import {extend} from '../extend'
import type {SanityObjectType, SanityType} from '../defs'
import type {SanityDocumentValue} from '../shapeDefs'

describe('circular schemas', () => {
  test('Circular SanityObjectType', () => {
    interface Human {
      _type: 'human'
      name: string
      age: number
    }

    //@ts-expect-error - should fail because name is not optional in the Human type, so they are not compatible
    const humanObject: SanityObjectType<Human> = object({
      _type: literal('human'),
      name: optional(string()),
      age: number(),
      parent: lazy(() => extend(humanObject, {extra: number()})),
    })
  })

  test('Circular SanityObjectType type with extended inner type', () => {
    interface Human {
      _type: 'human'
      name?: string
      age: number
      parent?: Human & {additionalInfo: string}
    }

    // @ts-expect-error – the schema declare the extended 'parent.additionalInfo' as optional, but that's not compatible with interface
    const human: SanityObjectType<Human> = object({
      _type: literal('human'),
      name: optional(string()),
      age: number(),
      parent: optional(
        lazy(() =>
          extend(human, {
            additionalInfo: optional(string()),
          }),
        ),
      ),
    })
  })
})

test('Restrictions', () => {
  // @ts-expect-error array of array is not allowed
  array(array(number()))

  // @ts-expect-error array of array is not allowed
  array(array(object({foo: string()})))

  // @ts-expect-error objectArray of a primitive value is not allowed
  objectArray(string())

  // @ts-expect-error mixed array (containing both objects and primitives) is not supported
  primitiveArray(union([object({foo: string()}), string()]))

  // @ts-expect-error mixed array (containing both objects and primitives) is not supported
  objectArray(union([object({foo: string()}), string()]))
})
