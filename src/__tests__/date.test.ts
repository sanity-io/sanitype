import {describe, expect, test} from 'vitest'

import {date} from '../creators/date'
import {safeParse} from '../parse'

describe('date type', () => {
  test('date type definition', () => {
    const dateSchema = date()
    expect(safeParse(dateSchema, '2023-01-22')).toMatchInlineSnapshot(`
      {
        "status": "ok",
        "value": "2023-01-22",
      }
    `)
  })
  test('errors', () => {
    const dateSchema = date()
    expect(safeParse(dateSchema, '2023-12-06')).toMatchInlineSnapshot(`
      {
        "status": "ok",
        "value": "2023-12-06",
      }
    `)
    expect(safeParse(dateSchema, '2023-12-06')).toMatchInlineSnapshot(`
      {
        "status": "ok",
        "value": "2023-12-06",
      }
    `)
    expect(safeParse(dateSchema, '2023-12-06 ')).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a date string on the format "YYYY-MM-DD" but got ""2023-12-06 """,
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
    expect(safeParse(dateSchema, '2023-1-6')).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a date string on the format "YYYY-MM-DD" but got ""2023-1-6""",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
    expect(safeParse(dateSchema, 'xyz')).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a date string on the format "YYYY-MM-DD" but got ""xyz""",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
    expect(safeParse(dateSchema, undefined)).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a date string on the format "yyyy-mm-dd" but got "undefined"",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
    expect(safeParse(dateSchema, {})).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a date string on the format "yyyy-mm-dd" but got "{}"",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
  })
})
