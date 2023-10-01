import {
  array,
  document,
  literal,
  object,
  parse,
  reference,
  resolve,
  string,
} from 'sanitype'

import type {SanityClient} from '@sanity/client'

declare const client: SanityClient

const address = object({
  city: string(),
  country: string(),
})

const human = document({
  _type: literal('human'),
  name: string(),
  address: array(address),
})

const pet = document({
  _type: literal('pet'),
  name: string(),
  humans: array(reference(human)),
})

const jaraAsJson = client.fetch('*[_type == "pet" && _id=="jara"][0]')

const jaraTheDog = parse(pet, jaraAsJson)

const humansOfJara = await Promise.all(
  jaraTheDog.humans.map(humanReference => resolve(humanReference)),
)

humansOfJara.forEach(humanOfJara => console.log(humanOfJara))
