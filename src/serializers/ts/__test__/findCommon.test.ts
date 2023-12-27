import {describe, expect, test} from 'vitest'
import {array, literal, number, object, string, union} from '../../../creators'
import {findCommon} from '../findCommon'

describe('find common / reused types', () => {
  test('when no common types', () => {
    expect(
      findCommon(
        object({
          _type: literal('foo'),
          prop: string(),
          num: number(),
        }),
      ),
    ).toEqual([])
  })
  test('when a single common types', () => {
    const common = object({
      prop: string(),
    })
    const foundCommon = findCommon(
      object({
        _type: literal('foo'),
        prop: string(),
        num: number(),
        common1: common,
        common2: common,
      }),
    )
    expect(foundCommon).toEqual([
      {type: common, paths: [['common1'], ['common2']]},
    ])
    // expect Object.is equality
    expect(foundCommon[0].type).toBe(common)
  })

  test('when used as a union', () => {
    const common = object({
      _type: literal('common'),
      prop: string(),
    })
    expect(
      findCommon(
        object({
          _type: literal('foo'),
          prop: string(),
          num: number(),
          common1: common,
          someUnion: union([
            common,
            object({_type: literal('other'), otherProp: number()}),
          ]),
        }),
      )[0],
    ).toEqual({
      paths: [['common1'], ['someUnion', 0]],
      type: common,
    })
  })

  test('when used in an array', () => {
    const common = object({
      _type: literal('common'),
      prop: string(),
    })
    expect(
      findCommon(
        object({
          _type: literal('foo'),
          prop: string(),
          num: number(),
          common,
          commonArray: array(common),
          unionWithCommon: union([
            common,
            object({_type: literal('other'), otherProp: number()}),
          ]),
        }),
      )[0],
    ).toEqual({
      paths: [['common'], ['commonArray'], ['unionWithCommon', 0]],
      type: common,
    })
  })
})
