import {document, literal, object, string} from 'sanitype'

export const person = document({
  _type: literal('person'),
  name: string(),
  address: object({
    street: string(),
    city: string(),
    country: string(),
  }),
})
