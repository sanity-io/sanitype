import {expect, test} from 'vitest'
import {literal, number, object, optional, string} from '../../../creators'
import {serialize} from '../serialize'
import {prettify, prettifyAll} from '../prettify'

const address = object({
  street: string(),
  city: string(),
  country: string(),
})

const person = object({
  _type: literal('person'),
  name: string(),
  address,
  secondaryAddress: address,
})

test('serialize to ts with a common object', async () => {
  expect(await prettifyAll(serialize(person))).toEqual([
    {
      name: 'address',
      source: `import {object, string} from "sanitype"

export const address = object({
  street: string(),
  city: string(),
  country: string(),
})
`,
    },
    {
      name: 'person',
      source: `import {literal, object, string} from "sanitype"
import {address} from "./address"

export const person = object({
  _type: literal("person"),
  name: string(),
  address: address,
  secondaryAddress: address,
})
`,
    },
  ])
})
