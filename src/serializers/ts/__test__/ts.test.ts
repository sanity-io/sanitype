import {expect, test} from 'vitest'
import {literal, number, object, string} from '../../../creators'
import {serialize} from '../serialize'
import {prettify} from '../prettify'

test('serialize to ts', async () => {
  expect(
    await prettify(
      serialize(
        object({
          _type: literal('foo'),
          prop: string(),
          num: number(),
        }),
      ),
    ),
  ).toEqual({
    name: 'foo',
    source: `import {literal, number, object, string} from "sanitype"
export const foo = object({
  _type: literal("foo"),
  prop: string(),
  num: number(),
})
`,
  })
})
