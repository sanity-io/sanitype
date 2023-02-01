// todo: make a human with firstname, lastname

import {array, document, lazy, object, reference, string} from "../factories.js"
import {fetchDocument} from "../createFetchDocument.js"
import {resolve} from "../createResolve.js"
import {ReferenceTo, SanityDocumentValue, SanityType} from "../defs.js"

// todo: define a "human" document schema with name: {first, last}

interface Human extends SanityDocumentValue {
  name: {
    first: string
    last: string
  }
  coworkers: (ReferenceTo<Human> & {_key: string})[]
}

const human: SanityType<Human> = document("human", {
  name: object({first: string(), last: string()}),
  coworkers: lazy(() => array(reference(human))),
})
// todo: fetch a human
const knut = await fetchDocument("knut", human)

// todo: make a "pet" document schema
// todo: make the pet have a reference to it's human
const pet = document("pet", {
  name: string(),
  human: reference(human),
})
// todo: fetch a pet
const jara = await fetchDocument("jara", pet)

// todo: resolve the pet's human
const jarasHuman = resolve(jara.human)

// todo: make the human have a list of coworkers

// todo: fetch all the pet's human's coworkers
const coworkers = await Promise.all(
  (await resolve(jara.human)).coworkers.map(coworker => resolve(coworker)),
)
