import {expect, test} from 'vitest'

import {enums} from '../creators/enums'
import {parse} from '../parse'

test('define string array enum', () => {
  const enumSchema = enums(['a', 'b', 'c'])
  expect(enumSchema.enum.a).toEqual('a')
  expect(enumSchema.enum.b).toEqual('b')
  expect(enumSchema.enum.c).toEqual('c')
})

test('define object literal enum', () => {
  const enumSchema = enums({foo: 'a', bar: 'b', baz: 'c'})
  expect(enumSchema.enum.foo).toEqual('a')
  expect(enumSchema.enum.bar).toEqual('b')
  expect(enumSchema.enum.baz).toEqual('c')
})

test('define object literal enum as const', () => {
  const enumDef = {foo: 'a', bar: 1, baz: 'c'} as const

  const enumSchema = enums(enumDef)
  expect(enumSchema.enum.foo).toEqual('a')
  expect(enumSchema.enum.bar).toEqual(1)
  expect(enumSchema.enum.baz).toEqual('c')
})

test('parse string array enum', () => {
  expect(parse(enums(['a', 'b', 'c']), 'a')).toEqual('a')
  expect(() =>
    parse(enums(['a', 'b', 'c']), 'x'),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid input at "<root>": Input doesn't match any of the valid enum values]`,
  )
})

test('parse object literal enum', () => {
  expect(parse(enums({foo: 'a', bar: 'b', baz: 'c'}), 'a')).toEqual('a')
  expect(() =>
    parse(enums(['a', 'b', 'c']), 'x'),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid input at "<root>": Input doesn't match any of the valid enum values]`,
  )
})
