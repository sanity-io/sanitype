import {expect, test} from 'vitest'

import {boolean} from '../../creators/boolean'
import {object} from '../../creators/object'
import {string} from '../../creators/string'
import {pickDeep} from '../pickDeep'

const obj = object({
  property: string(),
  other: string(),
  deep: object({
    deeper: object({done: boolean()}),
  }),
})

test('doesnt set keys not in schema', () => {
  expect(pickDeep(obj, {notInObj: 'ok'})).toMatchInlineSnapshot('{}')
})

test('set key in schema matching', () => {
  expect(pickDeep(obj, {property: 'ok'})).toEqual({
    property: 'ok',
  })
})
test('set key in schema matching deeper', () => {
  expect(
    pickDeep(obj, {
      property: 'ok',
      deep: {
        deeper: {done: false},
      },
    }),
  ).toEqual({
    property: 'ok',
    deep: {
      deeper: {
        done: false,
      },
    },
  })
})
