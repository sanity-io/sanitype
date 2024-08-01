import {expect, test} from 'vitest'

import {literal, object} from '../../creators'
import {collectTypeNames} from '../strictMode'

test('collectTypeNames', () => {
  expect(
    collectTypeNames(
      object({_type: literal('foo'), inner: object({_type: literal('foo')})}),
    ),
  ).toMatchInlineSnapshot(`
      {
        "foo": {
          "name": "foo",
          "paths": [
            [],
            [
              "inner",
            ],
          ],
        },
      }
    `)
})
