import {array, document, object, reference, string} from "../factories.js"
import {parse, safeParse} from "../parse.js"
import {createResolve} from "../createResolve.js"

const human = document("human", {
  name: string(),
})

const address = object({
  city: string(),
  country: string(),
})

const pet = document("pet", {
  name: string(),
  owners: array(reference(human)),
})

const input = `{"_type": "pet", "name": "fido"}`

const resolve = createResolve(async () => {})

const petData = parse(pet, JSON.parse(input))
const o = Promise.all(petData.owners.map(owner => resolve(owner)))
