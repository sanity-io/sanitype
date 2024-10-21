import {describe, expect, test} from 'vitest'

import {array, literal, object, string, union} from '../creators'
import {never} from '../creators/never'
import {parse} from '../parse'

describe('never type', () => {
  test('fails for any value', () => {
    const neverType = never()
    expect(() => parse(neverType, undefined)).toThrow()
    expect(() => parse(neverType, 1)).toThrow()
    expect(() => parse(neverType, {foo: 'bar'})).toThrow()
  })
  test('does not throw when included in union', () => {
    const unionWithNever = union([never(), string()])
    expect(() => parse(unionWithNever, 'some string')).not.toThrow()
    const objectUnionWithNever = union([
      object({_type: literal('foo'), foo: string()}),
      never(),
    ])
    expect(() =>
      parse(objectUnionWithNever, {_type: 'foo', foo: 'bar'}),
    ).not.toThrow()
  })
  test('does not throw for empty arrays', () => {
    const arrayWithNever = array(never())
    expect(() => parse(arrayWithNever, [])).not.toThrow()
  })
  test('does not throw for if included with arrays', () => {
    const arrayWithNever = array(union([never(), string()]))
    expect(() => parse(arrayWithNever, [])).not.toThrow()

    const objectArrayWithNever = array(
      union([never(), object({_type: literal('foo'), foo: string()})]),
    )
    expect(() => parse(objectArrayWithNever, [])).not.toThrow()
  })
  test('throw for non-empty arrays', () => {
    const unionWithNever = array(never())
    expect(() => parse(unionWithNever, ['foo'])).toThrow()
    expect(() => parse(unionWithNever, [{}])).toThrow()
  })
})
