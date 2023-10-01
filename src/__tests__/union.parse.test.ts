import {describe, expect, test} from 'vitest'
import {literal, number, object, string, union} from '../creators'
import {parse, safeParse} from '../parse'

describe('typed object union', () => {
  test('successful parsing', () => {
    const u = union([
      object({
        _type: literal('success'),
        status: literal('success'),
        data: string(),
      }),
      object({
        _type: literal('failure'),
        status: literal('failed'),
        error: string(),
      }),
    ])

    parse(u, {_type: 'success', status: 'success', data: 'it succeeded'})
  })
  test('successful parsing of unions of unions', () => {
    const u = union([
      object({
        _type: literal('a'),
      }),
      union([
        object({
          _type: literal('b'),
        }),
        object({
          _type: literal('c'),
        }),
        union([
          object({
            _type: literal('d'),
          }),
          object({
            _type: literal('e'),
          }),
        ]),
      ]),
    ])

    expect(parse(u, {_type: 'a'})).toEqual({_type: 'a'})
    expect(parse(u, {_type: 'b'})).toEqual({_type: 'b'})
    expect(parse(u, {_type: 'c'})).toEqual({_type: 'c'})
    expect(parse(u, {_type: 'd'})).toEqual({_type: 'd'})
    expect(parse(u, {_type: 'e'})).toEqual({_type: 'e'})

    expect(() => parse(u, {_type: 'x'})).toThrowErrorMatchingInlineSnapshot(
      '"Invalid input at \\"<root>\\": Type \\"x\\" not found among valid union types"',
    )
  })
  test('failed parsing when invalid literal value for discriminator', () => {
    const u = union([
      object({
        _type: literal('success'),
        status: literal('success'),
        data: string(),
      }),
      object({
        _type: literal('failure'),
        status: literal('failed'),
        error: string(),
      }),
    ])

    expect(safeParse(u, {status: 'neither'})).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_OBJECT_UNION",
            "message": "Input must be an object with a \\"_type\\"-property",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
  })
  test("failed parsing when schema doesn't match discriminated union type", () => {
    const u = union([
      object({
        _type: literal('success'),
        status: literal('success'),
        data: object({num: number()}),
      }),
      object({
        _type: literal('failure'),
        status: literal('failed'),
        error: string(),
      }),
    ])

    expect(safeParse(u, {status: 'success', data: {num: 'should be number'}}))
      .toMatchInlineSnapshot(`
        {
          "errors": [
            {
              "code": "INVALID_OBJECT_UNION",
              "message": "Input must be an object with a \\"_type\\"-property",
              "path": [],
            },
          ],
          "status": "fail",
        }
      `)
  })
})
