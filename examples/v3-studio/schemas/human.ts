import {
  array,
  boolean,
  document,
  extend,
  literal,
  object,
  string,
  union,
} from 'sanitype'

const pet = object({name: string()})
export const human = document({
  _type: literal('human'),
  name: string(),
  address: object({
    street: string(),
    city: string(),
    country: string(),
  }),
  pets: array(
    union([
      extend(pet, {
        _type: literal('bird'),
        squeaks: boolean(),
      }),
      extend(pet, {
        _type: literal('feline'),
        meows: boolean(),
      }),
      extend(pet, {
        _type: literal('canine'),
        barks: boolean(),
      }),
    ]),
  ),
})
