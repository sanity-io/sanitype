import {
  array,
  createResolve,
  document,
  literal,
  parse,
  reference,
  string,
} from 'sanitype'
import type {Infer} from 'sanitype'

const pet = document({_type: literal('pet'), name: string()})

declare const petOutput: Infer<typeof pet>

const person = document({
  _type: literal('person'),
  firstName: string(),
  lastName: string().optional(),
  favoritePet: reference(pet),
  pets: array(reference(pet)),
})

declare const personOutput: Infer<typeof person>

type Person = Infer<typeof person>

const aPerson = parse(person, {})
const resolve = createResolve(async () => {})
console.log(aPerson.favoritePet.__schema__)
const allPets = await Promise.all(aPerson.pets.map(pet => resolve(pet)))

const fetchedPet = await resolve(aPerson.favoritePet)

console.log(aPerson.favoritePet)
