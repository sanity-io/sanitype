import {describe, expectTypeOf, test} from 'vitest'

import {block, literal, number, object, string, union} from '../creators'
import {portableText} from '../creators/portableText'
import {type Infer} from '../defs'

describe('block type', () => {
  test('block type definition', () => {
    const portableTextSchema = portableText({
      block: block({
        list: union([literal('bullet'), literal('number')]),
        style: union([literal('normal'), literal('h1'), literal('h2')]),
        inline: object({
          _type: literal('author'),
          name: string(),
        }),
        decorator: union([literal('strong'), literal('em')]),
        annotation: union([
          object({_type: literal('author'), foo: number()}),
          object({_type: literal('book'), bar: number()}),
        ]),
      }),
      element: object({_type: literal('foobar')}),
    })

    type ExpectedBlockValue = Array<
      | {
          _type: 'block'
          listType: 'number' | 'bullet'
          style: 'normal' | 'h1' | 'h2'
          _key: string
          children: (
            | {_type: 'author'; name: string; _key: string}
            | {
                _type: 'span'
                _key: string
                text: string
                marks: ('strong' | 'em' | `ref-${string}`)[]
              }
          )[]
          markDefs: (
            | {_type: 'author'; foo: number; _key: string}
            | {_type: 'book'; bar: number; _key: string}
          )[]
          level?: number | undefined
        }
      | {_type: 'foobar'; _key: string}
    >

    type ActualType = Infer<typeof portableTextSchema>

    expectTypeOf<ActualType>().toEqualTypeOf<ExpectedBlockValue>()
  })

  test('block type definition without config', () => {
    const blockSchema = portableText({
      block: block({}),
      element: object({_type: literal('foobar')}),
    })

    type ExpectedBlockValue = Array<
      | {
          _type: 'block'
          _key: string
          style: never
          listType: never
          children: {
            _type: 'span'
            _key: string
            text: string
            marks: `ref-${string}`[]
          }[]
          level?: number
          markDefs: never[]
        }
      | {_type: 'foobar'; _key: string}
    >

    type ActualType = Infer<typeof blockSchema>

    expectTypeOf<ActualType>().toEqualTypeOf<ExpectedBlockValue>()
  })
})
