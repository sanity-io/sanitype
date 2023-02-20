import {
  array,
  document,
  lazy,
  literal,
  object,
  reference,
  string,
} from "../src/builders/index.js"
import {fetchDocument} from "../src/createFetchDocument.js"
import {resolve} from "../src/createResolve.js"
import {SanityType} from "../src/defs.js"
import {
  SanityArrayValue,
  SanityDocumentValue,
  SanityReferenceValue,
} from "../src/shapeDefs.js"

// todo: define a "human" document schema with name: {first, last}
interface Human extends SanityDocumentValue {
  name: {first: string; last: string}
  coworkers: SanityArrayValue<SanityReferenceValue<Human>>
}

const human: SanityType<Human> = lazy(() =>
  document({
    _type: literal("human"),
    name: object({first: string(), last: string()}),
    coworkers: array(reference(human)),
  }),
)

// todo: fetch a human
const knut = await fetchDocument("knut", human)

// todo: make a "pet" document schema
const pet = document({
  _type: literal("pet"),
  name: string(),
  human: reference(human),
})
const jara = await fetchDocument("jara", pet)

const jarasHuman = await resolve(jara.human)

const jarasHumansCoworkers = await Promise.all(
  jarasHuman.coworkers.map(async coworker => await resolve(coworker)),
)
jarasHumansCoworkers.forEach(human => {
  console.log(human._id)
})

// todo: make the pet have a reference to it's human

// todo: fetch a pet
// todo: resolve the pet's human
// todo: make the human have a list of coworkers
// todo: fetch all the pet's human's coworkers