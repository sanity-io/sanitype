import {expect, test} from 'vitest'
import {literal, number, object, optional, string} from '../../../creators'
import {serialize} from '../serialize'
import {prettify, prettifyAll} from '../prettify'

const address = object({
  street: optional(string()),
  city: optional(string()),
  country: optional(string()),
})

const person = object({
  _type: literal('person'),
  name: string(),
  address,
  secondaryAddress: optional(address),
})

test('serialize to ts with a common object', async () => {
  expect(await prettify(serialize(person))).toEqual([
    {
      name: 'address',
      source: `import {object, optional, string} from "sanitype"
export const address = object({
  street: optional(string()),
  city: optional(string()),
  country: optional(string()),
})
`,
    },
    {
      name: 'person',
      source: `import {literal, number, object, string} from "sanitype"
import {address} from "./address"
export const person = object({
  _type: literal("person"),
  name: string(),
  address: address,
  secondaryAddress: optional(address),
})
`,
    },
  ])
})
