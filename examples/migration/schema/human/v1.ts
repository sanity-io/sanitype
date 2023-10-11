import {array, document, literal, number, object, string} from 'sanitype'
import type {Infer} from 'sanitype'

const address = object({
  city: string(),
  country: string(),
})

export const human = document({
  _type: literal('human'),
  name: string(),
  oldTemporaryField: string(),
  age: number(),
  address: array(address),
})

export type Human = Infer<typeof human>

export const pet = document({
  _type: literal('pet'),
  name: string(),
})
