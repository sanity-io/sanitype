import {expect, test} from 'vitest'

import {boolean} from '../creators/boolean'
import {document} from '../creators/document'
import {literal} from '../creators/literal'
import {number} from '../creators/number'
import {object} from '../creators/object'
import {optional} from '../creators/optional'
import {string} from '../creators/string'
import {serializeSchema} from '../serializeSchema'

test('serialize primitive types', () => {
  expect(serializeSchema(string())).toEqual({typeName: 'string'})
  expect(serializeSchema(boolean())).toEqual({typeName: 'boolean'})
  expect(serializeSchema(number())).toEqual({typeName: 'number'})
})

test('serialize optional types', () => {
  expect(serializeSchema(optional(string()))).toEqual({
    typeName: 'optional',
    type: {typeName: 'string'},
  })
})

test('serialize literal types', () => {
  expect(serializeSchema(literal('foo'))).toEqual({
    typeName: 'literal',
    value: 'foo',
  })
  expect(serializeSchema(literal(22))).toEqual({typeName: 'literal', value: 22})
})

test('serialize object types', () => {
  const person = document({
    _type: literal('person'),
    name: string(),
    favoriteNumber: number(),
    address: object({
      _type: literal('address'),
      street: string(),
      city: string(),
      country: string(),
    }),
  })
  expect(serializeSchema(person)).toEqual({
    typeName: 'document',
    shape: [
      ['_type', {typeName: 'literal', value: 'person'}],
      [
        '_id',
        {
          typeName: 'optional',
          type: {typeName: 'string'},
        },
      ],
      [
        '_createdAt',
        {
          typeName: 'optional',
          type: {typeName: 'string'},
        },
      ],
      [
        '_updatedAt',
        {
          typeName: 'optional',
          type: {typeName: 'string'},
        },
      ],
      [
        '_rev',
        {
          typeName: 'optional',
          type: {typeName: 'string'},
        },
      ],
      ['name', {typeName: 'string'}],
      ['favoriteNumber', {typeName: 'number'}],
      [
        'address',
        {
          typeName: 'object',
          shape: [
            ['_type', {typeName: 'literal', value: 'address'}],
            ['street', {typeName: 'string'}],
            ['city', {typeName: 'string'}],
            ['country', {typeName: 'string'}],
          ],
        },
      ],
    ],
  })
})
