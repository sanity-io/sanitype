import {
  literal,
  object,
  ObjectTypeDef,
  parse,
  reference,
  Shape,
  string,
  union,
} from "./zanity"

function document<N extends string, T extends Shape<any>>(name: N, shape: T) {
  return object({
    ...shape,
  })
}

const country = object({
  _type: literal("country"),
  _createdAt: string(),
  _updatedAt: string(),
  _rev: string(),
  name: string(),
})

const pet = object({
  _type: literal("pet"),
  species: union([literal("dog"), literal("cat")]),
  name: string(),
})

const personType = document("person", {
  firstName: string(),
  lastName: string(),
  country: reference(country),
})

interface Document {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  [field: string]: unknown
}

type StripInternalRefType<T> = {
  [P in keyof T]: P extends "__internal_refTypeDef" ? never : T[P]
}

declare function expand<
  T extends {
    _type: "reference"
    _ref?: string
    readonly __internal_refTypeDef?: RefTypeDef
  },
  RefTypeDef extends ObjectTypeDef,
>(
  reference: T,
): T["__internal_refTypeDef"] extends ObjectTypeDef<any, infer Output>
  ? Promise<StripInternalRefType<Output>>
  : T extends {_weak: true}
  ? undefined | Document
  : Document

const person = parse(personType, {})

const personCountry = await expand(person.country)

const anonRef = await expand({_ref: "xyz", _type: "reference"})
