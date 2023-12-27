import {expect, test} from 'vitest'
import {literal, number, object, string} from '../../creators'
import {serializePretty} from '../ts'

test('serialize to ts', async () => {
  expect(
    await serializePretty(
      object({
        _type: literal('foo'),
        prop: string(),
        num: number(),
      }),
    ),
  ).toEqual({
    name: 'foo',
    source: `import {object, literal} from "sanitype"
export const foo = object({
  _type: literal("foo"),
  prop: string(),
  num: number(),
})
`,
  })
})
