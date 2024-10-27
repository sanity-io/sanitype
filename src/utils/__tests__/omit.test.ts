import {expect, test} from 'vitest'

import {document} from '../../creators/document'
import {literal} from '../../creators/literal'
import {number} from '../../creators/number'
import {object} from '../../creators/object'
import {string} from '../../creators/string'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  res.bar
})
