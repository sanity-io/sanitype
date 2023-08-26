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
  name: {
    first: string
    last: string
  }
  coworkers: SanityArrayValue<SanityReferenceValue<Human>>
}

const human: SanityType<Human> = document({
  _type: literal('human'),
  name: object({first: string(), last: string()}),
  coworkers: lazy(() => array(reference(human))),
})

// todo: fetch a human
const knut = await fetchDocument('knut', human)

// todo: make a "pet" document schema
// todo: make the pet have a reference to it's human
const pet = document({
  _type: literal('pet'),
  name: string(),
  human: reference(human),
})
// todo: fetch a pet
const jara = await fetchDocument('jara', pet)

// todo: resolve the pet's human
const jarasHuman = resolve(jara.human)

// todo: make the human have a list of coworkers

// todo: fetch all the pet's human's coworkers
const coworkers = await Promise.all(
  (await resolve(jara.human)).coworkers.map(coworker => resolve(coworker)),
)
