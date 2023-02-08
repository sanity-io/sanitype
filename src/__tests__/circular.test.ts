import type {Infer, SanityType} from "../defs.js"
import {OutputOf, SanityLazy, SanityObject, SanityString} from "../defs.js"
import {
  array,
  document,
  lazy,
  literal,
  number,
  object,
  reference,
  string,
} from "../builders/index.js"
import {parse} from "../parse.js"
import {test} from "vitest"
import {SanityDocumentValue} from "../shapeDefs.js"

interface Person {
  _type: "person"
  name: string
  parent?: Person
}

const person: SanityType<Person> = lazy(() =>
  object({
    _type: literal("person"),
    name: string(),
    parent: person,
  }),
)

test("typings", () => {
  type Obj = SanityType<{foo: string}>

  const obj: Obj = {} as any
  const output: OutputOf<typeof obj> = {} as any

  type Result = SanityType<{foo: string}>
  type LazyDef = SanityLazy<SanityObject<{foo: SanityString}>>

  const def: LazyDef = {} as any
  const r: Result = def
})
test("Schema types", () => {
  const parsed = parse(person, {})

  parsed?.parent?.name
  parsed?.parent?.parent?.name
  parsed?.parent

  const simple: SanityType<{foo: string}> = lazy(() => object({foo: string()}))

  type Simple = Infer<typeof simple>

  const p = parse(simple, {foo: "bar"})

  interface Circular {
    foo: string
    bar: number
    self: Circular
  }

  const shouldWork: SanityType<Circular> = lazy(() =>
    object({foo: string(), self: shouldWork, bar: number()}),
  )

  const r = parse(shouldWork, {})
  r.self?.self?.self
})

test("circular/lazy references", () => {
  interface Human extends SanityDocumentValue {
    name: string
  }

  const human: SanityType<Human> = document({
    _type: literal("human"),
    name: string(),
    pets: lazy(() => array(reference(pet))),
  })

  const pet = document({
    _type: literal("human"),
    name: string(),
    owner: reference(human),
  })
})
