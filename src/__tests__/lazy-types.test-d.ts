import {assertType, test} from 'vitest'

import {
  type OutputOf,
  type SanityLazy,
  type SanityLiteral,
  type SanityObject,
  type SanityObjectArray,
  type SanityString,
} from '../defs'

test('lazy string type', () => {
  type Lazy = SanityLazy<SanityString>

  assertType<OutputOf<Lazy>>('foo')
  //@ts-expect-error - not compatible with number
  assertType<OutputOf<Lazy>>(22)
})

test('lazy object type', () => {
  type Lazy = SanityLazy<
    SanityObject<{
      foo: SanityString
      lazy: SanityLazy<SanityLiteral<'literally this'>>
    }>
  >

  assertType<OutputOf<Lazy>>({foo: 'bar', lazy: 'literally this'})

  // @ts-expect-error - not compatible with array
  assertType<OutputOf<Lazy>>([])
})

test('lazy array type', () => {
  type Lazy = SanityLazy<
    SanityObjectArray<
      SanityObject<{_key: SanityString; foo: SanityLazy<SanityString>}>
    >
  >

  assertType<OutputOf<Lazy>>([])
  assertType<OutputOf<Lazy>>([{_key: 'abc', foo: 'bar'}])
  // @ts-expect-error - not compatible with array of strings
  assertType<OutputOf<Lazy>>(['foo'])
})
