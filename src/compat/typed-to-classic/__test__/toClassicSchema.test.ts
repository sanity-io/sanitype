import {expect, test} from 'vitest'

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
  string,
  union,
} from '../../../creators'
import {extend} from '../../../utils/extend'
import {toClassicSchema} from '../toClassicSchema'

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

test('toClassicSchema', () => {
  expect(toClassicSchema(human)).toMatchInlineSnapshot(`
    [
      {
        "fields": [
          {
            "name": "name",
            "type": "string",
          },
          {
            "fields": [
              {
                "name": "street",
                "type": "string",
              },
              {
                "name": "city",
                "type": "string",
              },
              {
                "name": "country",
                "type": "string",
              },
            ],
            "name": "address",
            "type": "object",
          },
          {
            "fields": [
              {
                "name": "alt",
                "type": "string",
              },
            ],
            "name": "profilePicture",
            "type": "image",
          },
          {
            "fields": [
              {
                "name": "description",
                "type": "string",
              },
            ],
            "name": "cv",
            "type": "file",
          },
          {
            "name": "portableText",
            "of": [
              {
                "name": "myCustomBlock",
                "of": [
                  {
                    "fields": [
                      {
                        "name": "name",
                        "type": "string",
                      },
                    ],
                    "name": "author",
                    "type": "object",
                  },
                  {
                    "fields": [
                      {
                        "name": "marks",
                        "of": [
                          {
                            "options": {
                              "list": [
                                "strong",
                              ],
                            },
                            "type": "string",
                          },
                        ],
                        "type": "array",
                      },
                      {
                        "name": "text",
                        "type": "string",
                      },
                    ],
                    "name": "span",
                    "type": "object",
                  },
                ],
                "type": "block",
              },
              {
                "fields": [],
                "name": "image",
                "type": "image",
              },
            ],
            "type": "array",
          },
          {
            "name": "pets",
            "of": [
              {
                "fields": [
                  {
                    "name": "name",
                    "type": "string",
                  },
                  {
                    "name": "squeaks",
                    "type": "boolean",
                  },
                ],
                "name": "avine",
                "type": "object",
              },
              {
                "fields": [
                  {
                    "name": "name",
                    "type": "string",
                  },
                  {
                    "name": "meows",
                    "type": "boolean",
                  },
                ],
                "name": "feline",
                "type": "object",
              },
              {
                "fields": [
                  {
                    "name": "name",
                    "type": "string",
                  },
                  {
                    "name": "barks",
                    "type": "boolean",
                  },
                ],
                "name": "canine",
                "type": "object",
              },
            ],
            "type": "array",
          },
        ],
        "name": "human",
        "type": "document",
      },
    ]
  `)
})
