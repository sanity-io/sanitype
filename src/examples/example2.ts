import {
  array,
  document,
  literal,
  optional,
  reference,
  string,
} from "../__deprecated_factories.js"
import {parse} from "../parse.js"
import {createResolve} from "../createResolve.js"
import {Infer} from "../defs.js"

const pet = document({_type: literal("pet"), name: string()})

declare const petOutput: Infer<typeof pet>

const person = document({
  _type: literal("person"),
  firstName: string(),
  lastName: optional(string()),
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
