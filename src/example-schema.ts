import {
  array,
  document,
  literal,
  object,
  reference,
  string,
  union,
} from "./factories"
import {parse} from "./parse"

function assertAssignable<A extends B, B>() {}

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
somePerson.visitedCountries[0]!
const references = somePerson.visitedCountries.map(country => [
  country._ref,
  country._key,
])
assertAssignable<[string, string][], typeof references>()
