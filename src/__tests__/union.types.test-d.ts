import {expectTypeOf, test} from 'vitest'

import {boolean} from '../creators/boolean'
import {literal} from '../creators/literal'
import {never} from '../creators/never'
import {number} from '../creators/number'
import {object} from '../creators/object'
import {string} from '../creators/string'
import {union} from '../creators/union'
import {type SanityNever, type SanityObjectUnion} from '../defs'
import {type ElementType} from '../helpers/utilTypes'

test('primitive unions', () => {
  union([string(), union([number(), boolean()])])
  union([string(), union([number(), never()])])
})
test('union of objects without _type', () => {
  union([
    //@ts-expect-error - missing _type
    object({foo: string()}),
  ])
})

test('object union of object union', () => {
  union([
    object({_type: literal('foo'), foo: string()}),
    object({_type: literal('bar'), foo: string()}),
    union([object({_type: literal('baz'), foo: string()})]),
    union([object({_type: literal('baz'), foo: string()}), never()]),
  ])
})

test('union type excludes never type', () => {
  expectTypeOf<ElementType<SanityObjectUnion['union']>>()
    .extract<SanityNever>()
    .toEqualTypeOf<never>()
})
