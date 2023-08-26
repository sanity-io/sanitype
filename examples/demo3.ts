import {
  array,
  document,
  fetchDocument,
  lazy,
  literal,
  object,
  reference,
  resolve,
  string,
} from 'sanitype'
import type {
  SanityArrayValue,
  SanityDocumentValue,
  SanityReferenceValue,
  SanityType,
} from 'sanitype'

// todo: define a "human" document schema with name: {first, last}
interface Human extends SanityDocumentValue {
  name: {first: string; last: string}
  coworkers: SanityArrayValue<SanityReferenceValue<Human>>
}

const human: SanityType<Human> = lazy(() =>
  document({
    _type: literal('human'),
    name: object({first: string(), last: string()}),
    coworkers: array(reference(human)),
  }),
)

// todo: fetch a human
const knut = await fetchDocument('knut', human)

// todo: make a "pet" document schema
const pet = document({
  _type: literal('pet'),
  name: string(),
  human: reference(human),
})
const jara = await fetchDocument('jara', pet)

jara.human

const jarasHuman = await resolve(jara.human)

const jarasHumansCoworkers = await Promise.all(
  jarasHuman.coworkers.map(async coworker => await resolve(coworker)),
)
jarasHumansCoworkers.forEach(hum => {
  console.log(hum._id)
})

// todo: make the pet have a reference to it's human

// todo: fetch a pet
// todo: resolve the pet's human
// todo: make the human have a list of coworkers
// todo: fetch all the pet's human's coworkers
