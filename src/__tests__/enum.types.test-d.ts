import {expectTypeOf, test} from 'vitest'

import {enums} from '../creators/enums'
import {type Infer, type SanityEnum} from '../defs'
import {parse} from '../parse'

test('define string array enum', () => {
  expectTypeOf<Infer<SanityEnum<['foo', 'bar', 'baz']>>>().toEqualTypeOf<
    'foo' | 'bar' | 'baz'
  >()
  expectTypeOf<Infer<SanityEnum<['foo', 'bar']>>>().toEqualTypeOf<
    // @ts-expect-error 'baz' is not valid
    'foo' | 'bar' | 'baz'
  >()
})

test('define object literal enum', () => {
  expectTypeOf<Infer<SanityEnum<{foo: 1; bar: 2; baz: 'baz'}>>>().toEqualTypeOf<
    1 | 2 | 'baz'
  >()

  expectTypeOf<Infer<SanityEnum<{foo: 1; bar: 2}>>>().toEqualTypeOf<
    // @ts-expect-error 'baz' is not valid
    1 | 2 | 'baz'
  >()
})

test('parse string array enum', () => {
  expectTypeOf(parse(enums(['a', 'b', 'c']), 'a')).toEqualTypeOf<
    'a' | 'b' | 'c'
  >()
})

test('parse object literal enum', () => {
  expectTypeOf(parse(enums({foo: 'a', bar: 'b', baz: 'c'}), 'a')).toEqualTypeOf<
    'a' | 'b' | 'c'
  >()
})
