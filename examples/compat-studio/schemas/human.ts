import {
  array,
  block,
  boolean,
  dateTime,
  document,
  extend,
  file,
  image,
  literal,
  number,
  object,
  string,
  union,
} from '@sanity/sanitype'

import {pet} from './pet'

export const human = document({
  _type: literal('human'),
  name: string(),
  profilePicture: image({
    caption: string(),
  }),
  favoriteTimestamp: dateTime(),
  address: object({
    street: string(),
    city: string(),
    country: string(),
  }),
  cv: file({
    description: string(),
  }),
  portableText: array(
    union([
      block({
        _type: literal('myCustomBlock'),
        styles: [literal('normal'), literal('h1'), literal('h2')],
        lists: [literal('bullet'), literal('number')],
        inlineTypes: [
          object({
            _type: literal('author'),
            name: string(),
          }),
        ],
        decorators: [literal('strong'), literal('em')],
        annotations: [
          object({_type: literal('author'), foo: number()}),
          object({_type: literal('book'), bar: number()}),
        ],
      }),
      image({}),
    ]),
  ),
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
