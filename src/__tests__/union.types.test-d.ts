import {test} from 'vitest'

import {boolean, literal, number, object, string, union} from '../creators'

test('primitive unions', () => {
  union([string(), union([number(), boolean()])])
})
test('union of objects without _type', () => {
  union([
    //@ts-expect-error - missing _type
    object({foo: string()}),
  ])
})

test('object union of object union', () => {
  union([
    object({_type: literal('foo'), foo: string()}),
    object({_type: literal('bar'), foo: string()}),
    union([object({_type: literal('baz'), foo: string()})]),
  ])
})
