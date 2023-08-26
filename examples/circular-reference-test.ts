import {
  array,
  document,
  lazy,
  literal,
  parse,
  reference,
  string,
} from 'sanitype'
import type {SanityDocumentValue, SanityType} from 'sanitype'

interface Human extends SanityDocumentValue {
  name: string
}

const human: SanityType<Human> = document({
  _type: literal('human'),
  name: string(),
  pets: lazy(() => array(reference(pet))),
})

const pet = document({
  _type: literal('pet'),
  name: string(),
  owner: reference(human),
  human: human,
})

const myPet = parse(pet, {name: 'fido', owner: {_type: 'human', name: 'bob'}})
// @ts-expect-error
myPet._foo
