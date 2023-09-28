import {
  array,
  document,
  literal,
  number,
  object,
  parse,
  reference,
  string,
  union,
} from 'sanitype'
import type {Infer} from 'sanitype'

const human = document({
  _type: literal('human'),
  name: object({first: string(), last: string()}),
})

const pet = document({
  _type: literal('pet'),
  name: string(),
  union: union([string(), number()]),
  humans: array(union([reference(human)])),
})

const somePet = parse(pet, {})

type Pet = Infer<typeof pet>

const someHuman = somePet.humans[0]
