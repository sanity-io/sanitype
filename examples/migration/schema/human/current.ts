import {
  array,
  document,
  literal,
  number,
  object,
  string,
  type Infer,
} from '@sanity/sanitype'

export type Human = Infer<typeof human>

export const address = object({
  city: string(),
  country: string(),
})

export const human = document({
  _type: literal('human'),
  name: string(),
  birthYear: number(),
  addresses: array(address),
})

export const pet = document({
  _type: literal('pet'),
  name: string(),
})
