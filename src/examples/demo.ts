import {array, document, literal, object, reference, string,} from "../builders/index.js"
import {parse} from "../parse.js"
import {createResolve} from "../createResolve.js"

const human = document({
  _type: literal("human"),
  name: string(),
})

const address = object({
  city: string(),
  country: string(),
})

const pet = document({
  _type: literal("pet"),
  name: string(),
  owners: array(reference(human)),
})

const input = `{"_type": "pet", "name": "fido"}`

const resolve = createResolve(async () => {})

const petData = parse(pet, JSON.parse(input))
const o = Promise.all(petData.owners.map(owner => resolve(owner)))
