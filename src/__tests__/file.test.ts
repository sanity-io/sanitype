import {describe, expect, test} from 'vitest'

import {file} from '../creators/file'
import {string} from '../creators/string'
import {safeParse} from '../parse'

const plainFileSchema = file({})

const customFileSchema = file({
  caption: string(),
})

describe('file type', () => {
  test('file type definition', () => {
    expect(
      safeParse(plainFileSchema, {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: '123',
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "status": "ok",
        "value": {
          "_type": "file",
          "asset": {
            "_ref": "123",
            "_type": "reference",
          },
        },
      }
    `)
    expect(
      safeParse(customFileSchema, {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: '123',
        },
        caption: 'An absolutely tip-top file for you.',
      }),
    ).toMatchInlineSnapshot(`
      {
        "status": "ok",
        "value": {
          "_type": "file",
          "asset": {
            "_ref": "123",
            "_type": "reference",
          },
          "caption": "An absolutely tip-top file for you.",
        },
      }
    `)
  })
  test('errors', () => {
    expect(
      safeParse(plainFileSchema, {
        _type: 'file',
      }),
    ).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected an object with keys {_type, _ref, _weak} but got "undefined"",
            "path": [
              "asset",
            ],
          },
        ],
        "status": "fail",
      }
    `)
    expect(
      safeParse(plainFileSchema, {
        _type: 'file',
        asset: {},
      }),
    ).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected literal value "reference" but got "undefined"",
            "path": [
              "asset",
              "_type",
            ],
          },
          {
            "code": "INVALID_TYPE",
            "message": "Expected a string but got "undefined"",
            "path": [
              "asset",
              "_ref",
            ],
          },
        ],
        "status": "fail",
      }
    `)
    expect(
      safeParse(customFileSchema, {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: '123',
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_TYPE",
            "message": "Expected a string but got "undefined"",
            "path": [
              "caption",
            ],
          },
        ],
        "status": "fail",
      }
    `)
  })
})
