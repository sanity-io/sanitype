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
            "input": "2023-12-06",
            "message": "Expected a dateTime string on the format "YYYY-MM-DDTHH:mm:ss.sssZ"",
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
              "input": "2023-12-06T19:01:07  ",
              "message": "Expected a dateTime string on the format "YYYY-MM-DDTHH:mm:ss.sssZ"",
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
            "input": "xyz",
            "message": "Expected a dateTime string on the format "YYYY-MM-DDTHH:mm:ss.sssZ"",
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
            "input": undefined,
            "message": "Expected a string",
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
            "input": {},
            "message": "Expected a string",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
  })
})
