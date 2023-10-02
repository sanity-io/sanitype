import {expect, test} from 'vitest'
import {inspect} from '../inspect'

class CustomClass {
  foo = 'bar'
  constructor(public greeting: string) {}
}

test('default formatting', () => {
  expect(inspect(undefined)).toMatchInlineSnapshot('undefined')
  expect(inspect('foo')).toMatchInlineSnapshot('"\\"foo\\""')
  expect(inspect([])).toMatchInlineSnapshot('"[]"')

  expect(inspect([1, 2, 3])).toMatchInlineSnapshot('"[1, 2, 3]"')
  expect(inspect([1, 2, 3], {maxLength: 1})).toMatchInlineSnapshot(
    '"[1, …(+2)]"',
  )

  expect(inspect(new Set([1, 2, 3]))).toMatchInlineSnapshot('"Set[1, 2, 3]"')
  expect(inspect(new Set([1, new Set([2]), 3]))).toMatchInlineSnapshot(
    '"Set[1, Set[2], 3]"',
  )

  expect(inspect(new Promise(resolve => {}))).toMatchInlineSnapshot(
    '"Promise{}"',
  )
  expect(inspect(new Error('oof'))).toMatchInlineSnapshot('"Error{}"')
  expect(inspect(new ArrayBuffer(10))).toMatchInlineSnapshot('"ArrayBuffer{}"')

  expect(inspect(BigInt('9007199254740991'))).toMatchInlineSnapshot(
    '"BigInt(\\"9007199254740991\\")"',
  )
  expect(inspect(new RegExp(/ok/))).toMatchInlineSnapshot('"RegExp{}"')
  expect(inspect(new URL('http://example.com'))).toMatchInlineSnapshot(
    '"URL{}"',
  )
  expect(inspect(Symbol.iterator)).toMatchInlineSnapshot(
    '"Symbol(Symbol.iterator)"',
  )

  expect(inspect(Symbol('ok'))).toMatchInlineSnapshot('"Symbol(ok)"')
  expect(inspect(() => {})).toMatchInlineSnapshot('"() => {  }"')
  expect(inspect(function foo() {})).toMatchInlineSnapshot(
    '"function foo() {  }"',
  )

  expect(
    inspect(function foo() {
      // eslint-disable-next-line no-console
      console.log('testing')
    }),
  ).toMatchInlineSnapshot('"function foo() {   …"')

  expect(inspect(CustomClass)).toMatchInlineSnapshot('"class CustomClass {…"')
  expect(inspect(new CustomClass('hello'))).toMatchInlineSnapshot(
    '"CustomClass{foo: \\"bar\\", greeting: \\"hello\\"}"',
  )

  expect(inspect({})).toMatchInlineSnapshot('"{}"')
  expect(inspect({foo: 'bar'})).toMatchInlineSnapshot(`
    "{foo: \\"bar\\"}"
  `)

  expect(
    inspect({foo: 'bar', baz: {a: 'a', b: 'b', c: 'c', d: 'd'}}),
  ).toMatchInlineSnapshot(
    '"{foo: \\"bar\\", baz: {a: \\"a\\", b: \\"b\\", …(+2)}}"',
  )

  expect(
    inspect(
      new Map([
        ['a', 'a'],
        ['b', 'b'],
        ['c', 'c'],
        ['d', 'd'],
      ]),
    ),
  ).toMatchInlineSnapshot('"Map{a: \\"a\\", b: \\"b\\", …(+2)}"')
})
