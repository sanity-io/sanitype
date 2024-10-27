import {expect, test} from 'vitest'

import {array} from '../../creators/array'
import {literal} from '../../creators/literal'
import {number} from '../../creators/number'
import {object} from '../../creators/object'
import {string} from '../../creators/string'
import {union} from '../../creators/union'
import {parse} from '../../parse'
import {deepPartial} from '../deepPartial'

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
