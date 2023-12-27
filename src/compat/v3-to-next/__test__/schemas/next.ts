import {
  array,
  block,
  boolean,
  document,
  file,
  image,
  literal,
  number,
  object,
  optional,
  string,
  union,
} from '../../../../creators'
import {extend} from '../../../../utils/extend'

const pet = object({name: optional(string())})
export const human = document({
  _type: literal('human'),
  name: optional(string()),
  address: optional(
    object({
      street: optional(string()),
      city: optional(string()),
      country: optional(string()),
    }),
  ),
  profilePicture: optional(
    image({
      alt: optional(string()),
    }),
  ),
  cv: optional(
    file({
      description: optional(string()),
    }),
  ),
  portableText: optional(
    array(
      union([
        block({
          styles: [literal('normal'), literal('h1'), literal('h2')],
          lists: [literal('bullet'), literal('number')],
          inlineTypes: [
            object({
              _type: literal('author'),
              name: optional(string()),
            }),
          ],
          decorators: [literal('strong'), literal('em')],
          annotations: [
            object({_type: literal('author'), foo: optional(number())}),
            object({_type: literal('book'), bar: optional(number())}),
          ],
        }),
        image({}),
      ]),
    ),
  ),
  pets: optional(
    array(
      union([
        extend(pet, {
          _type: literal('avine'),
          squeaks: optional(boolean()),
        }),
        extend(pet, {
          _type: literal('feline'),
          meows: optional(boolean()),
        }),
        extend(pet, {
          _type: literal('canine'),
          barks: optional(boolean()),
        }),
      ]),
    ),
  ),
})
