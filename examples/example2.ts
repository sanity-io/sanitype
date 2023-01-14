import {array, document, reference, string} from "../src/factories2"
import {parse} from "../src/parse"
import {expand} from "../src/expand"
import {Infer, OutputOf} from "../src/defs"

const pet = document("pet", {name: string()})

declare const petOutput: OutputOf<typeof pet>

const person = document("person", {
  firstName: string(),
  lastName: string(),
  favoritePet: reference(pet),
  pets: array(reference(pet)),
})

declare const personOutput: OutputOf<typeof person>

type Person = Infer<typeof person>

const aPerson = parse(person, {})
console.log(aPerson.favoritePet["@@internal_ref_type"])
const allPets = await Promise.all(aPerson.pets.map(pet => expand(pet)))

const fetchedPet = await expand(aPerson.favoritePet)

console.log(aPerson.favoritePet)
