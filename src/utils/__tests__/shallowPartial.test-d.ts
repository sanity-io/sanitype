import {assertType, expectTypeOf, test} from 'vitest'
import {type ShallowPartial} from '../shallowPartial'
import {
  type Infer,
  type SanityLiteral,
  type SanityNumber,
  type SanityObject,
  type SanityObjectArray,
  type SanityObjectUnion,
  type SanityOptional,
  type SanityString,
} from '../../defs'

test('shallow partial on nested type', () => {
  type Nested = {
    prop: SanityNumber
    array: SanityObjectArray<
      SanityObjectUnion<
        | SanityObject<{_type: SanityLiteral<'a'>; str: SanityString}>
        | SanityObject<{_type: SanityLiteral<'b'>; num: SanityNumber}>
      >
    >
  }

  type Obj = SanityObject<{
    foo: SanityString
    sub: SanityObject<Nested>
  }>

  expectTypeOf<ShallowPartial<Obj>>().toEqualTypeOf<
    SanityObject<{
      foo: SanityOptional<SanityString>
      sub: SanityOptional<SanityObject<Nested>>
    }>
  >()

  assertType<Infer<ShallowPartial<Obj>>>({})
  assertType<Infer<ShallowPartial<Obj>>>({
    foo: 'bar',
  })
  assertType<Infer<ShallowPartial<Obj>>>({
    //@ts-expect-error should be object if provided
    sub: 'bar',
  })
  assertType<Infer<ShallowPartial<Obj>>>({})
  assertType<Infer<ShallowPartial<Obj>>>({
    sub: {
      //@ts-expect-error _key should still be required
      array: [{str: 'foo'}],
    },
  })
})
