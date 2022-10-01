import {
  array,
  Infer,
  OutputFromShape,
  object,
  ObjectTypeDef,
  parse,
  PrimitiveType,
  Shape,
  string,
  Type,
  OutputOf,
  lazy,
  OutputType,
  objectArray,
} from "./zanity"
import {MaybeAddKeyToArrayProps, ObjectType} from "./types"

type Person = {
  name: string
  parents: Person[]
}

type WithKeys = MaybeAddKeyToArrayProps<Person>

const person: ObjectType<Person> = lazy(() =>
  object({
    name: string(),
    parents: objectArray(person),
  }),
)

const parsed = parse(person, {})

parsed.parents.map(parent => parent.name)
parsed.parents.map(parent => parent._key)

// export type Person = Infer<typeof person>

// export type Type<Output, Def extends any = any> = Type<Def, Output>
export type Lazy<T extends Type> = Type<T["def"], T["output"]>

type I = OutputFromShape<Shape<{foo: PrimitiveType<string>}>>

type O = ObjectTypeDef<Shape<{foo: PrimitiveType<string>}>>

const simple: OutputType<{foo: string}> = lazy(() => object({foo: string()}))

type Simple = Infer<typeof simple>

const p = parse(simple, {foo: "bar"})

interface Circular {
  foo: string
  self: Circular
}

const shouldWork: OutputType<Circular> = lazy(() =>
  object({foo: string(), self: shouldWork}),
)

const r = parse(shouldWork, {})
r.self.self.self
