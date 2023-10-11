import {expect, test} from 'vitest'
import {document, literal, object, string} from '../../creators'
import {createLiteralValue} from '../createLiteralValue'

test('create literal value from document schema', () => {
  const catSchema = document({
    _type: literal('cat'),
    sound: literal('miau'),
    breed: string(),
    metadata: object({
      tag: literal('xyz'),
    }),
    name: string(),
  })
  const myCat = createLiteralValue(catSchema)
  expect(myCat).toEqual({
    _type: 'cat',
    metadata: {
      tag: 'xyz',
    },
    sound: 'miau',
  })
})

test('create literal value from literal schema', () => {
  const someLiteral = literal('lit')
  const myLit = createLiteralValue(someLiteral)
  expect(myLit).toEqual('lit')
})

test('create literal value from object schema', () => {
  const schema = object({foo: literal('bar'), someString: string()})
  const value = createLiteralValue(schema)
  expect(value).toEqual({foo: 'bar'})
})
