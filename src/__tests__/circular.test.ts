import {test} from 'vitest'
import {
  array,
  boolean,
  document,
  lazy,
  literal,
  number,
  object,
  reference,
  string,
} from '../creators'
import {parse} from '../parse'
import {optional} from '../creators/optional'
import {extend} from '../extend'
import type {
  Infer,
  OutputOf,
  SanityLazy,
  SanityObject,
  SanityObjectType,
  SanityString,
  SanityType,
} from '../defs'

import type {SanityDocumentValue} from '../shapeDefs'
import type {MergeObject} from '../utils/utilTypes'

interface Person {
  _type: 'person'
  name: string
  parent?: Person
}

const person: SanityType<Person> = lazy(() =>
  object({
    _type: literal('person'),
    name: string(),
    parent: optional(lazy(() => person)),
  }),
)

test('typings', () => {
  type Obj = SanityType<{foo: string}>

  const obj: Obj = {} as any
  const output: OutputOf<typeof obj> = {} as any

  type Result = SanityType<{foo: string}>
  type LazyDef = SanityLazy<SanityObject<{foo: SanityString}>>

  const def: LazyDef = {} as any
  const r: Result = def
})
test('Schema types', () => {
  const parsed = parse(person, {_type: 'person', name: 'foo'})

  parsed?.parent?.name
  parsed?.parent?.parent?.name
  parsed?.parent

  const simple: SanityType<{foo: string}> = lazy(() => object({foo: string()}))

  type Simple = Infer<typeof simple>

  const p = parse(simple, {foo: 'bar'})

  interface Circular {
    foo: string
    bar: number
    self?: Circular
  }

  const shouldWork: SanityType<Circular> = object({
    foo: string(),
    bar: number(),
    self: optional(lazy(() => shouldWork)),
  })

  const r = parse(shouldWork, {foo: 'bar', bar: 1, self: {foo: 'bar', bar: 1}})
  r.self?.self?.self
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
    _type: literal('human'),
    name: string(),
    owner: reference(human),
  })
})

test('SanityType', () => {
  interface Human extends SanityDocumentValue {
    _type: 'human'
    name: string
    age: number
  }

  //@ts-expect-error - should fail because name is not optional in the Human type, so they are not compatible
  const humanDoc: SanityType<Human> = document({
    _type: literal('human'),
    name: optional(string()),
    age: number(),
  })
})
test('circular types', () => {
  interface Human {
    _type: 'human'
    name?: string
    age: number
    parent?: Human & {foo?: string}
  }

  const human: SanityObjectType<Human> = object({
    _type: literal('human'),
    name: optional(string()),
    age: number(),
    parent: optional(lazy(() => extend(human, {foo: optional(string())}))),
  })

  type H = MergeObject<OutputOf<typeof human>>
})
