import {describe, expectTypeOf, test} from 'vitest'

import {array, block, literal, number, object, string, union} from '../creators'
import {type Infer} from '../defs'

describe('block type', () => {
  test('block type definition', () => {
    const blockSchema = block({
      styles: [literal('normal'), literal('h1'), literal('h2')],
      lists: [literal('bullet'), literal('number')],
      inlineTypes: [
        object({
          _type: literal('author'),
          name: string(),
        }),
      ],
      decorators: [literal('strong'), literal('em')],
      annotations: [
        object({_type: literal('author'), foo: number()}),
        object({_type: literal('book'), bar: number()}),
      ],
    })

    type BlockValue = {
      _type: 'block'
      listType?: 'bullet' | 'number'
      style?: 'normal' | 'h1' | 'h2'
      level?: number
      children: (
        | {_type: 'author'; name: string; _key: string}
        | {
            _type: 'span'
            marks: ('strong' | 'em' | `ref-${string}`)[]
            text: string
            _key: string
          }
      )[]
      markDefs: (
        | {_type: 'author'; foo: number; _key: string}
        | {_type: 'book'; bar: number; _key: string}
      )[]
    }

    expectTypeOf<Infer<typeof blockSchema>>().toEqualTypeOf<BlockValue>()
  })
  test('portable text array', () => {
    const portableTextArray = array(
      union([
        block({
          styles: [literal('normal'), literal('h1'), literal('h2')],
          lists: [literal('bullet'), literal('number')],
          inlineTypes: [
            object({
              _type: literal('author'),
              name: string(),
            }),
          ],
          decorators: [literal('strong'), literal('em')],
          annotations: [
            object({_type: literal('author'), foo: number()}),
            object({_type: literal('book'), bar: number()}),
          ],
        }),
        object({_type: literal('message'), text: string()}),
      ]),
    )

    type PortableTextArrayValue = (
      | {
          _type: 'block'
          _key: string
          listType?: 'bullet' | 'number'
          style?: 'normal' | 'h1' | 'h2'
          level?: number
          children: (
            | {_type: 'author'; name: string; _key: string}
            | {
                _type: 'span'
                marks: ('strong' | 'em' | `ref-${string}`)[]
                text: string
                _key: string
              }
          )[]
          markDefs: (
            | {_type: 'author'; foo: number; _key: string}
            | {_type: 'book'; bar: number; _key: string}
          )[]
        }
      | {_type: 'message'; text: string; _key: string}
    )[]

    expectTypeOf<
      Infer<typeof portableTextArray>
    >().toEqualTypeOf<PortableTextArrayValue>()
  })
})
