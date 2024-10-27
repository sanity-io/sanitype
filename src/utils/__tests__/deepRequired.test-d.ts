import {assertType, expectTypeOf, test} from 'vitest'

import {lazy} from '../../creators/lazy'
import {literal} from '../../creators/literal'
import {object} from '../../creators/object'
import {optional} from '../../creators/optional'
import {string} from '../../creators/string'
import {
  type Infer,
  type SanityBoolean,
  type SanityDocument,
  type SanityLiteral,
  type SanityNumber,
  type SanityObject,
  type SanityObjectArray,
  type SanityObjectType,
  type SanityObjectUnion,
  type SanityOptional,
  type SanityString,
} from '../../defs'
import {parse} from '../../parse'
import {type DeepRequired, deepRequired} from '../deepRequired'
import {extend} from '../extend'
import {omit} from '../omit'

test('deep required on primitive types', () => {
  expectTypeOf<DeepRequired<SanityString>>().toEqualTypeOf<SanityString>()
  expectTypeOf<DeepRequired<SanityBoolean>>().toEqualTypeOf<SanityBoolean>()
  expectTypeOf<DeepRequired<SanityNumber>>().toEqualTypeOf<SanityNumber>()
})

test('deep required on shallow object type', () => {
  type Obj = SanityObject<{foo: SanityOptional<SanityString>}>
  expectTypeOf<DeepRequired<Obj>>().toEqualTypeOf<
    SanityObject<{foo: SanityString}>
  >()
})

test('deep required on shallow document type', () => {
  type Doc = SanityDocument<{
    _type: SanityLiteral<'test'> // _type can never be optional
    _id: SanityOptional<SanityString>
    _createdAt: SanityOptional<SanityString>
    _updatedAt: SanityOptional<SanityString>
    _rev: SanityOptional<SanityString>
    foo: SanityOptional<SanityString>
  }>

  expectTypeOf<DeepRequired<Doc>>().toEqualTypeOf<
    SanityDocument<{
      _type: SanityLiteral<'test'>
      _id: SanityString
      _createdAt: SanityString
      _updatedAt: SanityString
      _rev: SanityString
      foo: SanityString
    }>
  >()
})

test('deep required on union types', () => {
  type Union = SanityObjectUnion<
    | SanityObject<{
        _type: SanityLiteral<'a'>
        str: SanityOptional<SanityString>
      }>
    | SanityObject<{
        _type: SanityLiteral<'b'>
        num: SanityOptional<SanityNumber>
      }>
  >

  expectTypeOf<DeepRequired<Union>>().toEqualTypeOf<
    SanityObjectUnion<
      | SanityObject<{_type: SanityLiteral<'a'>; str: SanityString}>
      | SanityObject<{_type: SanityLiteral<'b'>; num: SanityNumber}>
    >
  >()
})

test('deep required on literal types', () => {
  type Obj = SanityObject<{foo: SanityOptional<SanityLiteral<'bar'>>}>
  expectTypeOf<DeepRequired<Obj>>().toEqualTypeOf<
    SanityObject<{foo: SanityLiteral<'bar'>}>
  >()
})

test('deep required on object array type', () => {
  type Arr = SanityObjectArray<
    SanityObject<{str: SanityOptional<SanityString>}>
  >

  expectTypeOf<DeepRequired<Arr>>().toEqualTypeOf<
    SanityObjectArray<SanityObject<{str: SanityString}>>
  >()
})
test('deep required on object array type with union elements', () => {
  type Arr = SanityObjectArray<
    SanityObjectUnion<
      | SanityObject<{
          _type: SanityLiteral<'a'>
          str: SanityOptional<SanityString>
        }>
      | SanityObject<{
          _type: SanityLiteral<'b'>
          num: SanityOptional<SanityNumber>
        }>
    >
  >

  expectTypeOf<DeepRequired<Arr>>().toEqualTypeOf<
    SanityObjectArray<
      SanityObjectUnion<
        | SanityObject<{_type: SanityLiteral<'a'>; str: SanityString}>
        | SanityObject<{_type: SanityLiteral<'b'>; num: SanityNumber}>
      >
    >
  >()
})

test('deep required on nested type', () => {
  type Obj = SanityObject<{
    foo: SanityOptional<SanityString>
    sub: SanityOptional<
      SanityObject<{
        prop: SanityOptional<SanityNumber>
        array: SanityOptional<
          SanityObjectArray<
            SanityObjectUnion<
              | SanityObject<{
                  _type: SanityLiteral<'a'>
                  str: SanityOptional<SanityString>
                }>
              | SanityObject<{
                  _type: SanityLiteral<'b'>
                  num: SanityOptional<SanityNumber>
                }>
            >
          >
        >
      }>
    >
  }>

  expectTypeOf<DeepRequired<Obj>>().toEqualTypeOf<
    SanityObject<{
      foo: SanityString
      sub: SanityObject<{
        prop: SanityNumber
        array: SanityObjectArray<
          SanityObjectUnion<
            | SanityObject<{_type: SanityLiteral<'a'>; str: SanityString}>
            | SanityObject<{_type: SanityLiteral<'b'>; num: SanityNumber}>
          >
        >
      }>
    }>
  >()

  assertType<Infer<DeepRequired<Obj>>>({foo: 'bar', sub: {array: [], prop: 2}})
  // @ts-expect-error - sub is required
  assertType<Infer<DeepRequired<Obj>>>({
    foo: 'bar',
  })
  assertType<Infer<DeepRequired<Obj>>>({
    //@ts-expect-error should be object if provided
    sub: 'bar',
  })
  assertType<Infer<DeepRequired<Obj>>>({
    foo: '',
    sub: {
      prop: 1,
      array: [{_type: 'a', _key: 'xyz', str: 'foo'}],
    },
  })
})

test('deep required on circular object type', () => {
  interface Person {
    _type: 'person'
    name: string
    parent: Omit<Person, 'parent'> & {
      foo: string
      parent?: Omit<Person, 'parent'>
    }
  }

  const lazyPerson: SanityObjectType<Person> = object({
    _type: literal('person'),
    name: lazy(() => string()),
    parent: lazy(() =>
      extend(lazyPerson, {
        foo: string(),
        parent: optional(omit(lazyPerson, ['parent'])),
      }),
    ),
  })

  const requiredLazyPerson = deepRequired(lazyPerson)
  const res = parse(requiredLazyPerson, {})

  expectTypeOf(res).toEqualTypeOf<{
    _type: 'person'
    name: string
    parent: {
      _type: 'person'
      name: string
      foo: string
      parent: {_type: 'person'; name: string}
    }
  }>()
})
