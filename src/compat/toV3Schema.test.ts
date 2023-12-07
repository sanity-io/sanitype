import {expect, test} from 'vitest'
import {
  array,
  boolean,
  document,
  file,
  image,
  literal,
  object,
  string,
  union,
} from '../creators'
import {extend} from '../utils/extend'
import {toV3Schema} from './toV3Schema'

const pet = object({name: string()})
export const human = document({
  _type: literal('human'),
  name: string(),
  address: object({
    street: string(),
    city: string(),
    country: string(),
  }),
  profilePicture: image({
    alt: string(),
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

test('toV3Schema', () => {
  expect(toV3Schema(human)).toEqual([
    {
      name: 'human',
      type: 'document',
      fields: [
        {name: 'name', type: 'string'},
        {
          name: 'address',
          type: 'object',
          fields: [
            {name: 'street', type: 'string'},
            {name: 'city', type: 'string'},
            {name: 'country', type: 'string'},
          ],
        },
        {
          name: 'profilePicture',
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
            },
          ],
        },
        {
          name: 'cv',
          type: 'file',
          fields: [
            {
              name: 'description',
              type: 'string',
            },
          ],
        },
        {
          name: 'pets',
          type: 'array',
          of: [
            {
              name: 'avine',
              type: 'object',
              fields: [
                {name: 'name', type: 'string'},
                {name: 'squeaks', type: 'boolean'},
              ],
            },
            {
              name: 'feline',
              type: 'object',
              fields: [
                {name: 'name', type: 'string'},
                {name: 'meows', type: 'boolean'},
              ],
            },
            {
              name: 'canine',
              type: 'object',
              fields: [
                {name: 'name', type: 'string'},
                {name: 'barks', type: 'boolean'},
              ],
            },
          ],
        },
      ],
    },
  ])
})
