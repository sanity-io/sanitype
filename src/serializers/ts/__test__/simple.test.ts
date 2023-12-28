import {expect, test} from 'vitest'
import {literal, number, object, string} from '../../../creators'
import {prettifyAll} from '../prettify'
import {serialize} from '../serialize'

test('simple serialize to ts', async () => {
  expect(
    await prettifyAll(
      serialize(
        object({
          _type: literal('foo'),
          prop: string(),
          num: number(),
        }),
      ),
    ),
  ).toEqual([
    {
      name: 'foo',
      source: `import {literal, number, object, string} from "sanitype"

export const foo = object({
  _type: literal("foo"),
  prop: string(),
  num: number(),
})
`,
    },
  ])
})
