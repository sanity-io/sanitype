import {SanityDocumentValue, SanityType} from "../defs.js"
import {array, document, lazy, reference, string} from "../factories.js"
import {parse} from "../parse.js"

interface Human extends SanityDocumentValue {
  name: string
}

const human: SanityType<Human> = document("human", {
  name: string(),
  pets: lazy(() => array(reference(pet))),
})

const pet = document("pet", {
  name: string(),
  owner: reference(human),
  human: human,
})

const myPet = parse(pet, {name: "fido", owner: {_type: "human", name: "bob"}})
// @ts-expect-error
myPet._foo
