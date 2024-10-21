import {describe, expectTypeOf, test} from 'vitest'

import {
  array,
  literal,
  number,
  object,
  objectArray,
  string,
  union,
} from '../creators'
import {never} from '../creators/never'
import {type Infer} from '../defs'

describe('array types', () => {
  test('array type definition with object item', () => {
    const arraySchema = array(object({foo: string()}))

    type ArrayValueType = {foo: string; _key: string}[]

    type InferredValueType = Infer<typeof arraySchema>
    expectTypeOf<InferredValueType>().toEqualTypeOf<ArrayValueType>()
  })

  test('array type definition with union of objects', () => {
    const arraySchema = array(
      union([
        object({_type: literal('foo'), foo: string()}),
        object({_type: literal('bar'), bar: number()}),
      ]),
    )

    type ExpectedType = (
      | {_type: 'foo'; foo: string; _key: string}
      | {_type: 'bar'; bar: number; _key: string}
    )[]

    type ActualType = Infer<typeof arraySchema>

    expectTypeOf<ActualType>().toEqualTypeOf<ExpectedType>()
  })

  test('array type definition with never', () => {
    const arraySchema = array(never())

    expectTypeOf<Infer<typeof arraySchema>>().toEqualTypeOf<never[]>()
  })
  test('array type definition with object and never', () => {
    const arraySchema = objectArray(
      union([object({_type: literal('foo'), foo: string()}), never()]),
    )

    type ExpectedType = {_type: 'foo'; foo: string; _key: string}[]

    type ActualType = Infer<typeof arraySchema>

    expectTypeOf<ActualType>().toEqualTypeOf<ExpectedType>()
  })
})
