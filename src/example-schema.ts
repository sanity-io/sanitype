import {
  array,
  Infer,
  literal,
  object,
  ObjectSchema,
  Shape,
  string,
  union,
} from "./zanity"

function document<T extends Shape<any>, N extends string>(name: N, shape: T) {
  return object({
    _type: literal(name),
    _createdAt: string(),
    _updatedAt: string(),
    _rev: string(),
    ...shape,
  })
}

function reference(to: ObjectSchema<any>) {
  return object({
    _type: literal("reference"),
    _ref: string(),
  })
}

const countrySchema = document("country", {
  name: string(),
})

const petSchema = object({
  _type: literal("pet"),
  species: union([literal("dog"), literal("cat")]),
  name: string(),
})

const personSchema = document("person", {
  firstName: string(),
  lastName: string(),
  address: object({
    _type: literal("address"),
    street: string(),
    zip: string(),
    country: string(),
  }),
  visitedCountries: array(reference(countrySchema)),
  pets: array(petSchema),
})

function assertAssignable<A extends B, B>() {}

const personRef = reference(countrySchema)

type PersonSchema = Infer<typeof personSchema>

const person = personSchema.parse({})

const keys = person.pets.map(pet => pet._key)
assertAssignable<string[], typeof keys>()

const references = person.visitedCountries.map(country => [
  country._ref,
  country._key,
])
assertAssignable<[string, string][], typeof references>()
