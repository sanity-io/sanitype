import {expect, test} from 'vitest'

import {
  array,
  document,
  literal,
  number,
  object,
  optional,
  string,
  union,
} from '../../creators'
import {strictMode} from '../strictMode'

test('valid strict mode types', () => {
  expect(() => strictMode(string())).not.toThrow()
  expect(() => strictMode(number())).not.toThrow()
  expect(() => strictMode(union([string(), number()]))).not.toThrow()
  expect(() => strictMode(array(union([string(), number()])))).not.toThrow()
  expect(() => strictMode(literal('foo'))).not.toThrow()
  expect(() => strictMode(object({foo: 'bar'}))).not.toThrow()
  expect(() => strictMode(object({_type: literal('bar')}))).not.toThrow()
  expect(() => strictMode(array(object({_type: literal('bar')})))).not.toThrow()
  expect(() =>
    strictMode(
      array(
        union([
          object({_type: literal('foo')}),
          object({_type: literal('bar')}),
        ]),
      ),
    ),
  ).not.toThrow()
  expect(() =>
    strictMode(
      document({
        _type: literal('testdoc'),
        nested: array(
          union([
            object({
              _type: literal('foo'),
              optional: optional(
                object({
                  _type: literal('optional'),
                }),
              ),
            }),
            object({_type: literal('bar')}),
          ]),
        ),
      }),
    ),
  ).not.toThrow()
})

test('invalid strict mode types', () => {
  expect(() =>
    strictMode(
      object({_type: literal('bar'), inner: object({_type: literal('bar')})}),
    ),
  ).toThrow(/GraphQL Strict Mode error/)
  expect(() => strictMode(array(object({_type: literal('bar')})))).not.toThrow()
  expect(() =>
    strictMode(
      array(
        union([
          object({_type: literal('foo')}),
          object({
            _type: literal('bar'),
            inner: object({_type: literal('bar')}),
          }),
        ]),
      ),
    ),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: GraphQL Strict Mode error: Duplicate named types found in schema: Found object with _type: "bar" at bar, bar -> inner]`,
  )
  expect(() =>
    strictMode(
      document({
        _type: literal('test'),
        nested: array(
          union([
            object({
              _type: literal('foo'),
              optional: optional(
                object({
                  _type: literal('bar'),
                }),
              ),
            }),
            object({_type: literal('bar')}),
          ]),
        ),
      }),
    ),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: GraphQL Strict Mode error: Duplicate named types found in schema: Found object with _type: "bar" at (root), bar]`,
  )
})
