import {
  array,
  boolean,
  literal,
  object,
  ObjectTypeDef,
  parse,
  Shape,
  string,
  union,
} from "./zanity"

function assertAssignable<A extends B, B>() {}

function document<N extends string, T extends Shape<any>>(name: N, shape: T) {
  return object({
    _type: literal(name),
    _createdAt: string(),
    _updatedAt: string(),
    _rev: string(),
    ...shape,
  })
}

function reference(to: ObjectTypeDef<any>) {
  return object({
    _type: literal("reference"),
    _ref: string(),
    _weak: boolean(),
  })
}

const country = document("country", {
  name: string(),
})

const pet = object({
  _type: literal("pet"),
  species: union([literal("dog"), literal("cat")]),
  name: string(),
})

const person = document("person", {
  firstName: string(),
  lastName: string(),
  address: object({
    _type: literal("address"),
    street: string(),
    zip: string(),
    country: string(),
  }),
  visitedCountries: array(reference(country)),
  pets: array(pet),
})

const somePerson = parse(person, {})

const keys = somePerson.pets.map(pet => pet._key)

assertAssignable<string[], typeof keys>()

const references = somePerson.visitedCountries.map(country => [
  country._ref,
  country._key,
])
assertAssignable<[string, string][], typeof references>()
