import {defineType} from '@sanity/types'
import {expect, test} from 'vitest'
import {collectValidationRules} from '../collectValidationRules'

test('collectValidationRules', () => {
  expect(
    collectValidationRules(
      defineType({
        type: 'string',
        name: 'someString',
        validation: Rule => Rule.min(2).max(5).required(),
      }),
    ),
  ).toMatchInlineSnapshot(`
    [
      {
        "args": [
          2,
        ],
        "prop": "min",
      },
      {
        "args": [
          5,
        ],
        "prop": "max",
      },
      {
        "args": [],
        "prop": "required",
      },
    ]
  `)
})
