import {describe, expect, test} from 'vitest'

import {image} from '../creators/image'
import {string} from '../creators/string'
import {safeParse} from '../parse'

const plainImageSchema = image({})

const customImageSchema = image({
  caption: string(),
})

describe('image type', () => {
  test('image type definition', () => {
    expect(
      safeParse(plainImageSchema, {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: '123',
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "status": "ok",
        "value": {
          "_type": "image",
          "asset": {
            "_ref": "123",
            "_type": "reference",
          },
        },
      }
    `)
    expect(
      safeParse(customImageSchema, {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: '123',
        },
        caption: 'A nice pic of my favourite lizard, Leon.',
      }),
    ).toMatchInlineSnapshot(`
      {
        "status": "ok",
        "value": {
          "_type": "image",
          "asset": {
            "_ref": "123",
            "_type": "reference",
          },
          "caption": "A nice pic of my favourite lizard, Leon.",
        },
      }
    `)
  })
  test('errors', () => {
    expect(
      safeParse(plainImageSchema, {
        _type: 'image',
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
      safeParse(plainImageSchema, {
        _type: 'image',
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
      safeParse(customImageSchema, {
        _type: 'image',
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
