import {expectTypeOf, test} from 'vitest'

import {
  type SanityBoolean,
  type SanityDocument,
  type SanityNumber,
  type SanityString,
} from '../../defs'
import {type PickShape} from '../pick'

test('pick from document', () => {
  type Doc = SanityDocument<{
    foo: SanityString
    bar: SanityNumber
    baz: SanityBoolean
  }>
  expectTypeOf<PickShape<Doc, ['foo', 'bar']>>().toEqualTypeOf<
    SanityDocument<{
      foo: SanityString
      bar: SanityNumber
    }>
  >()

  expectTypeOf<PickShape<Doc, ['foo']>>().toEqualTypeOf<
    // @ts-expect-error bar should not be part of the new type
    SanityDocument<{
      foo: SanityString
      bar: SanityNumber
    }>
  >()
})
