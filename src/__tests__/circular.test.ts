import type {Infer, SanityType} from "../defs2"
import {lazy, literal, number, object, string} from "../factories2"
import {parse} from "../parse"
import {test} from "vitest"

interface Person {
  _type: "person"
  name: string
  parent: Person
}

const person: SanityType<Person> = lazy(() =>
  object({
    _type: literal("person"),
    name: string(),
    parent: person,
  }),
)
test("Schema types", () => {
  const parsed = parse(person, {})

  parsed.parent.name
  parsed.parent.parent.name
  parsed.parent

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
  r.self.self.self
})
