import {array, document, reference, string} from "../factories.js"
import {parse} from "../parse.js"
import {expand} from "../expand.js"
import {Infer} from "../defs.js"

const pet = document("pet", {name: string()})

declare const petOutput: Infer<typeof pet>

const person = document("person", {
  firstName: string(),
  lastName: string(),
  favoritePet: reference(pet),
  pets: array(reference(pet)),
})

declare const personOutput: Infer<typeof person>

type Person = Infer<typeof person>

const aPerson = parse(person, {})

console.log(aPerson.favoritePet["@@internal_ref_type"])
const allPets = await Promise.all(aPerson.pets.map(pet => expand(pet)))

const fetchedPet = await expand(aPerson.favoritePet)

console.log(aPerson.favoritePet)
