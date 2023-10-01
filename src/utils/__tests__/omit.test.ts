import {expect, test} from 'vitest'
import {document, literal, number, object, string} from '../../creators'
import {parse} from '../../parse'
import {omit} from '../omit'

test('omit from a document', () => {
  const doc = document({
    _type: literal('something'),
    foo: string(),
    bar: number(),
  })
  const res = parse(omit(doc, ['bar']), {
    _id: 'some-id',
    _type: 'something',
    foo: 'Foo',
    bar: 1,
  })
  expect(res).toEqual({
    _id: 'some-id',
    _type: 'something',
    foo: 'Foo',
  })

  // @ts-expect-error bar should be omitted
  res.bar
})

test('omit from an object', () => {
  const obj = object({
    _type: literal('something'),
    foo: string(),
    bar: number(),
  })
  const res = parse(omit(obj, ['bar']), {
    _type: 'something',
    foo: 'Foo',
    bar: 1,
  })
  expect(res).toEqual({
    _type: 'something',
    foo: 'Foo',
  })

  // @ts-expect-error bar should be omitted
  res.bar
})
