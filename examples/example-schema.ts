import {
  array,
  createResolve,
  document,
  literal,
  number,
  object,
  OutputOf,
  parse,
  reference,
  string,
  union,
} from "sanitype"

function assertAssignable<A extends B, B>() {}

const country = document({
  _type: literal("country"),
  name: string(),
})

const pet = object({
  _type: literal("pet"),
  species: union([literal("dog"), literal("cat")]),
  name: string(),
})
declare const petOutput: OutputOf<typeof pet>

const list = array(object({test: string()}))

declare const listOutput: OutputOf<typeof list>

const person = document({
  _type: literal("person"),
  firstName: string(),
  lastName: string(),
  address: object({
    _type: literal("address"),
    street: string(),
    zip: string(),
    country: reference(country),
  }),
  visitedCountries: array(reference(country)),
  pets: array(pet),
})

declare const personOutput: OutputOf<typeof person>

const polyObjectArr = array(
  union([
    object({_type: literal("foo"), foo: string()}),
    object({_type: literal("two"), age: number()}),
  ]),
)
declare const stringOrNumOut: OutputOf<typeof polyObjectArr>

const t = reference(country)

const somePerson = parse(person, {})

console.log(somePerson.address.country)

const resolve = createResolve(() => Promise.resolve())
const somePersonCountry = await resolve(somePerson.address.country)

const keys = somePerson.pets.map(pet => pet._key)

assertAssignable<string[], typeof keys>()
somePerson.visitedCountries[0]!
const references = somePerson.visitedCountries.map(country => [
  country._ref,
  country._key,
])
assertAssignable<[string, string][], typeof references>()
