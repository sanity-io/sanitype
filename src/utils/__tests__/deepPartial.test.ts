import {expect, test} from 'vitest'

import {
  array,
  lazy,
  literal,
  number,
  object,
  optional,
  string,
  union,
} from '../../creators'
import {parse} from '../../parse'
import {deepPartial} from '../deepPartial'
import {extend} from '../extend'
import type {SanityObjectType} from '../../defs'

test('deep partial on nested object', () => {
  const u = union([
    object({_type: literal('some'), str: string()}),
    object({_type: literal('other'), num: number(), hint: string()}),
  ])
  const obj = object({
    foo: string(),
    sub: object({
      prop: number(),
      array: array(u),
    }),
  })

  expect(parse(deepPartial(obj), {})).toEqual({})
  expect(
    parse(deepPartial(obj), {
      sub: {
        array: [{_type: 'some', _key: 'xyz', hint: 'hello'}],
      },
    }),
  ).toMatchInlineSnapshot(`
    {
      "sub": {
        "array": [
          {
            "_key": "xyz",
            "_type": "some",
          },
        ],
      },
    }
  `)
})
