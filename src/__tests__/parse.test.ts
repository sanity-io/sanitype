import {assertType, describe, expect, test} from 'vitest'
import {parse, safeParse} from '../parse'

import {
  array,
  document,
  lazy,
  literal,
  object,
  optional,
  reference,
  string,
  union,
} from '../creators'
import {INTERNAL_REF_TYPE_SCHEMA} from '../defs'
import type {SanityObjectType, SanityType} from '../defs'
import type {SanityDocumentValue} from '../shapeDefs'

describe('string parsing', () => {
  test('successful parsing', () => {
    const schema = string()
    const parsed = safeParse(schema, 'foo')
    expect(parsed).toMatchObject({
      status: 'ok',
      value: 'foo',
    })
  })
  test('failed parsing', () => {
    const schema = string()
    const parsed = safeParse(schema, undefined)
    expect(parsed).toMatchObject({
      status: 'fail',
      errors: [{path: [], code: 'INVALID_TYPE', message: /.+/}],
    })
  })
})

describe('object parsing', () => {
  test('parsing of simple object', () => {
    const schema = object({foo: string()})
    const parsed = safeParse(schema, {foo: 'bar'})
    expect(parsed).toMatchObject({
      status: 'ok',
      value: {foo: 'bar'},
    })
  })
  test('parsing of complex object', () => {
    const schema = object({
      title: string(),
      nested: object({something: string()}),
    })
    const parsed = safeParse(schema, {
      title: 'hello',
      nested: {something: 'world'},
    })
    expect(parsed).toMatchObject({
      status: 'ok',
      value: {title: 'hello', nested: {something: 'world'}},
    })
  })
  test('failed parsing', () => {
    const schema = object({
      title: string(),
      nested: object({something: string()}),
    })
    const parsed = safeParse(schema, {title: 'hello', nested: {something: 1}})

    expect(parsed).toMatchObject({
      status: 'fail',
      errors: [
        {path: ['nested', 'something'], code: 'INVALID_TYPE', message: /.+/},
      ],
    })
  })
  describe('circular/lazy types', () => {
    test('circular/lazy', () => {
      type Person = {
        name: string
        parent?: Person
      }
      const person: SanityType<Person> = object({
        name: string(),
        parent: optional(lazy(() => person)),
      })

      const parsed = safeParse(person, {
        name: 'Tester',
        parent: {name: "Tester's parent"},
      })

      expect(parsed).toEqual({
        status: 'ok',
        value: {name: 'Tester', parent: {name: "Tester's parent"}},
      })
    })
  })
  test('Circular object types', () => {
    interface Person {
      _type: 'person'
      name: string
      parent?: Person
    }

    const person: SanityObjectType<Person> = object({
      _type: literal('person'),
      name: string(),
      parent: optional(lazy(() => person)),
    })

    const parsed = parse(person, {
      _type: 'person',
      name: 'foo',
      parent: {_type: 'person', name: 'another'},
    })

    expect(parsed).toEqual({
      _type: 'person',
      name: 'foo',
      parent: {_type: 'person', name: 'another'},
    })
  })

  test('circular/lazy references', () => {
    interface Human extends SanityDocumentValue {
      name: string
    }

    const human: SanityType<Human> = document({
      _type: literal('human'),
      name: string(),
      pets: lazy(() => array(reference(pet))),
    })

    const pet = document({
      _type: literal('pet'),
      name: string(),
      owner: reference(human),
    })

    const parsed = parse(pet, {
      _type: 'pet',
      name: 'Jara',
      owner: {_type: 'reference', _ref: 'knut'},
    })
    expect(parsed).toEqual({
      _type: 'pet',
      name: 'Jara',
      owner: {
        _ref: 'knut',
        _type: 'reference',
      },
    })
    assertType<SanityType<Human>>(parsed.owner.__schema__)
  })
})

describe('object array parsing', () => {
  test('parsing of simple array', () => {
    const schema = array(object({foo: string()}))
    const parsed = safeParse(schema, [{_key: 'akey', foo: 'bar'}])
    expect(parsed).toMatchObject({
      status: 'ok',
      value: [{_key: 'akey', foo: 'bar'}],
    })
  })
  test('parsing of single union array', () => {
    const schema = array(
      union([object({_type: literal('foo'), foo: string()})]),
    )
    const parsed = safeParse(schema, [
      {_key: 'somekey', _type: 'foo', foo: 'bar'},
    ])
    expect(parsed).toMatchObject({
      status: 'ok',
      value: [{_key: 'somekey', _type: 'foo', foo: 'bar'}],
    })
  })
  test('parsing of multi union array', () => {
    const schema = array(
      union([
        object({_type: literal('foo'), fooProp: string()}),
        object({_type: literal('bar'), barProp: string()}),
      ]),
    )
    const parsed = safeParse(schema, [
      {_type: 'foo', _key: 'somekey', fooProp: 'foo'},
    ])
    expect(parsed).toMatchObject({
      status: 'ok',
      value: [{_type: 'foo', _key: 'somekey', fooProp: 'foo'}],
    })
  })
  test('failed parsing', () => {
    const schema = array(
      union([
        object({_type: literal('foo'), nested: object({foo: string()})}),
        object({_type: literal('bar'), barProp: string()}),
      ]),
    )
    const parsed = safeParse(schema, [
      {_type: 'foo', _key: 'key213s', nested: {foo: 1}},
    ])

    expect(parsed).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_OBJECT_UNION",
            "message": "Cannot parse input as union type "foo"",
            "path": [
              "key213s",
            ],
          },
          {
            "code": "INVALID_TYPE",
            "message": "Expected a string but got "1"",
            "path": [
              "key213s",
              "nested",
              "foo",
            ],
          },
        ],
        "status": "fail",
      }
    `)
  })
})

describe('reference parsing', () => {
  test('parsing of simple reference', () => {
    const personSchema = document({_type: literal('person'), name: string()})
    const referenceSchema = reference(personSchema)

    const parsed = parse(referenceSchema, {
      _ref: 'some-person',
      _type: 'reference',
    })

    expect(parsed[INTERNAL_REF_TYPE_SCHEMA].typeName).toBe('document')

    expect(parsed).toEqual({
      _ref: 'some-person',
      _type: 'reference',
    })
  })
})
