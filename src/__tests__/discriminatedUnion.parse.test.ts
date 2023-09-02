import {describe, expect, test} from 'vitest'
import {discriminatedUnion, literal, number, object, string} from '../creators'
import {parse, safeParse} from '../parse'

describe('discriminated union', () => {
  test('successful parsing', () => {
    const union = discriminatedUnion('status', [
      object({status: literal('success'), data: string()}),
      object({status: literal('failed'), error: string()}),
    ])

    parse(union, {status: 'success', data: 'it succeeded'})
  })
  test('failed parsing when invalid literal value for discriminator', () => {
    const union = discriminatedUnion('status', [
      object({status: literal('success'), data: string()}),
      object({status: literal('failed'), error: string()}),
    ])

    expect(safeParse(union, {status: 'neither'})).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_DISCRIMINATED_UNION",
            "message": "Input is not valid as the discriminated union type status=\\"neither\\"",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
  })
  test("failed parsing when schema doesn't match discriminated union type", () => {
    const union = discriminatedUnion('status', [
      object({status: literal('success'), data: object({num: number()})}),
      object({status: literal('failed'), error: string()}),
    ])

    expect(
      safeParse(union, {status: 'success', data: {num: 'should be number'}}),
    ).toMatchInlineSnapshot(`
        {
          "errors": [
            {
              "code": "INVALID_DISCRIMINATED_UNION",
              "message": "Input is not valid as the discriminated union type status=\\"success\\"",
              "path": [],
            },
            {
              "code": "INVALID_TYPE",
              "message": "Expected a number but got \\"'should be number'\\"",
              "path": [
                "data",
                "num",
              ],
            },
          ],
          "status": "fail",
        }
      `)
  })
})
