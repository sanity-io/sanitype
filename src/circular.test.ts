import {Infer, lazy, number, object, objectArray, parse, string} from "./zanity"
import {Lazy} from "./types"

type Person = {
  name: string
  parents: Person[]
}

const person: Lazy<Person> = lazy(() =>
  object({
    name: string(),
    parents: objectArray(person),
  }),
)

const parsed = parse(person, {})

parsed.parents.map(parent => parent.name)
parsed.parents.map(parent => parent._key)
parsed.parents.map(parent => parent.parents.map(p => p._key))
parsed.parents.map(parent =>
  parent.parents.map(p => p.parents.map(p1 => p1._key)),
)

const simple: Lazy<{foo: string}> = lazy(() => object({foo: string()}))

type Simple = Infer<typeof simple>

const p = parse(simple, {foo: "bar"})

interface Circular {
  foo: string
  bar: number
  self: Circular
}

const shouldWork: Lazy<Circular> = lazy(() =>
  object({foo: string(), self: shouldWork, bar: number()}),
)

const r = parse(shouldWork, {})
r.self.self.self
