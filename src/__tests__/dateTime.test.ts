import {describe, expect, test} from 'vitest'
import {dateTime} from '../creators/dateTime'
import {safeParse} from '../parse'

describe('dateTime type', () => {
  test('parsing dateTime', () => {
    const dateTimeSchema = dateTime()
    expect(safeParse(dateTimeSchema, '2023-12-06T19:01:07.512Z'))
      .toMatchInlineSnapshot(`
      {
        "status": "ok",
        "value": "2023-12-06T19:01:07.512Z",
      }
    `)
  })

  test('errors', () => {
    const dateTimeSchema = dateTime()
    expect(safeParse(dateTimeSchema, '2023-12-06')).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a dateTime string on the format "YYYY-MM-DDTHH:mm:ss.sssZ" but got ""2023-12-06""",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
    expect(safeParse(dateTimeSchema, '2023-12-06T19:01:07  '))
      .toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a dateTime string on the format "YYYY-MM-DDTHH:mm:ss.sssZ" but got ""2023-12-06T19:01:07  """,
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
    expect(safeParse(dateTimeSchema, 'xyz')).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a dateTime string on the format "YYYY-MM-DDTHH:mm:ss.sssZ" but got ""xyz""",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
    expect(safeParse(dateTimeSchema, undefined)).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a string but got "undefined"",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
    expect(safeParse(dateTimeSchema, {})).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a string but got "{}"",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
  })
})
