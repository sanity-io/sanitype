import {expect, test} from 'vitest'
import {document, literal, number, object, string} from '../../creators'
import {pick} from '../pick'
import {parse} from '../../parse'

test('pick from a document', () => {
  const doc = document({
    _type: literal('something'),
    foo: string(),
    bar: number(),
  })
  const res = parse(pick(doc, ['foo']), {
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

test('pick from an object', () => {
  const obj = object({
    _type: literal('something'),
    foo: string(),
    bar: number(),
  })
  const res = parse(pick(obj, ['foo']), {
    foo: 'Foo',
    bar: 1,
  })
  expect(res).toEqual({
    foo: 'Foo',
  })

  // @ts-expect-error bar should be omitted
  res.bar
})
