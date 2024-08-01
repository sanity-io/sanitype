import {expectTypeOf, test} from 'vitest'
import {type OmitShape} from '../omit'
import {
  type SanityBoolean,
  type SanityDocument,
  type SanityNumber,
  type SanityString,
} from '../../defs'

test('omit from document', () => {
  type Doc = SanityDocument<{
    foo: SanityString
    bar: SanityNumber
    baz: SanityBoolean
  }>
  expectTypeOf<OmitShape<Doc, ['foo', 'bar']>>().toEqualTypeOf<
    SanityDocument<{
      baz: SanityBoolean
    }>
  >()

  expectTypeOf<OmitShape<Doc, ['foo']>>().toEqualTypeOf<
    // @ts-expect-error foo should not be part of the new type
    SanityDocument<{
      foo: SanityString
      bar: SanityNumber
    }>
  >()
})
