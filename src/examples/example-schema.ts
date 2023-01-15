import {
  array,
  document,
  literal,
  number,
  object,
  reference,
  string,
  union,
} from "../factories.js"
import {parse} from "../parse.js"
import {expand} from "../expand.js"
import {OutputOf} from "../defs.js"

function assertAssignable<A extends B, B>() {}

const country = document("country", {
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

const person = document("person", {
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

const somePersonCountry = await expand(somePerson.address.country)

const keys = somePerson.pets.map(pet => pet._key)

assertAssignable<string[], typeof keys>()
somePerson.visitedCountries[0]!
const references = somePerson.visitedCountries.map(country => [
  country._ref,
  country._key,
])
assertAssignable<[string, string][], typeof references>()