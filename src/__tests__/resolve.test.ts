import {expect, expectTypeOf, test, vi} from 'vitest'

import {createResolve} from '../createResolve'
import {document, literal, reference, string} from '../creators'
import {type Infer} from '../defs'
import {parse} from '../parse'

const country = document({
  _type: literal('country'),
  name: string(),
})

const personType = document({
  _type: literal('person'),
  firstName: string(),
  lastName: string(),
  country: reference(country),
})

test('resolve reference with schema', async () => {
  const person = parse(personType, {
    _id: 'carl',
    _type: 'person',
    firstName: 'Carl',
    lastName: 'Sagan',
    country: {_type: 'reference', _ref: 'usa'},
  })

  const fetch = vi.fn().mockResolvedValueOnce({
    _type: 'country',
    _id: 'usa',
    name: 'USA',
  })
  const resolve = createResolve(fetch)

  const personCountry = await resolve(person.country)
  expect(fetch.mock.calls).toEqual([['usa']])
  expect(personCountry).toEqual({
    _type: 'country',
    _id: 'usa',
    name: 'USA',
  })

  expectTypeOf(personCountry).toEqualTypeOf<Infer<typeof country>>()
})
