import {assertType, describe, expectTypeOf, test} from 'vitest'
import {literal, number, object, string} from '../../creators'
import {extend} from '../extend'
import {parse} from '../../parse'

describe('extends helper', () => {
  test('simple extends', () => {
    const obj = object({str: string(), num: number()})
    const extended = extend(obj, {extendedStr: string(), extendedNum: number()})

    const parsed = parse(extended, {
      str: 'foo',
      num: 1,
      extendedStr: 'bar',
      extendedNum: 1,
    })

    assertType<{
      str: string
      num: number
      extendedStr: string
      extendedNum: number
    }>(parsed)

    assertType<{
      str: string
      num: string
      extendedStr: string
      extendedNum: number
    }>(
      //@ts-expect-error num should be number
      parsed,
    )
  })

  test('extends w/override', () => {
    const obj = object({
      changedFromStringToLiteralString: string(),
      changedFromNumberToString: number(),
    })

    const extended = extend(obj, {
      changedFromStringToLiteralString: literal('literally this'),
      changedFromNumberToString: string(),
    })

    const parsed = parse(extended, {
      changedFromStringToLiteralString: 'literally this',
      changedFromNumberToString: 'a string',
    })

    assertType<'literally this'>(parsed.changedFromStringToLiteralString)
    assertType<{
      changedFromStringToLiteralString: 'literally this'
      changedFromNumberToString: string
    }>(parsed)

    assertType<string>(parsed.changedFromNumberToString)

    // @ts-expect-error extended type has been refined to literal and is no longer compatible with string
    assertType<typeof parsed.changedFromStringToLiteralString>('' as string)

    // @ts-expect-error extended type has been changed from number to string
    assertType<number>(parsed.changedFromNumberToString)
  })
})
