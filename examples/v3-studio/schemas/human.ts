import {
  array,
  boolean,
  document,
  extend,
  file,
  image,
  literal,
  object,
  string,
  union,
} from 'sanitype'

const pet = object({name: string()})
export const human = document({
  _type: literal('human'),
  name: string(),
  profilePicture: image({
    caption: string(),
  }),
  address: object({
    street: string(),
    city: string(),
    country: string(),
  }),
  cv: file({
    description: string(),
  }),
  pets: array(
    union([
      extend(pet, {
        _type: literal('avine'),
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
