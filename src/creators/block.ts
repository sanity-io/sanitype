import {defineType} from '../helpers/defineType'
import {string} from './string'
import {literal} from './literal'
import {object} from './object'
import {optional} from './optional'
import {union} from './union'
import {number} from './number'
import {array} from './array'
import type {FlattenUnionTypes} from './union'
import type {ElementType} from '../helpers/utilTypes'
import type {
  SanityBlock,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityObjectUnion,
  SanityOptional,
  SanityPrimitiveArray,
  SanityPrimitiveUnion,
  SanityString,
  SanityTypedObject,
} from '../defs'

export function _markDefRef(): SanityLiteral<`ref-${string}`> {
  return literal(`ref-$id`)
}

export type BlockObjectShape<
  Styles extends SanityLiteral<string>,
  Lists extends SanityLiteral<string>,
  InlineTypes extends (
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>
  )[],
  Decorators extends SanityLiteral<string>,
  Annotations extends (
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>
  )[],
> = {
  _type: SanityLiteral<'block'>
  style: SanityOptional<SanityPrimitiveUnion<Styles>>
  level: SanityOptional<SanityNumber>
  listType: SanityOptional<SanityPrimitiveUnion<Lists>>
  children: SanityObjectArray<
    SanityObjectUnion<
      | FlattenUnionTypes<ElementType<InlineTypes>>
      | SanityObject<{
          _type: SanityLiteral<'span'>
          marks: SanityPrimitiveArray<
            Decorators | SanityLiteral<`ref-${string}`>
          >
          text: SanityString
        }>
    >
  >
  markDefs: SanityObjectArray<ElementType<Annotations>>
}

export type BlockOptions<
  Styles extends SanityLiteral<string>,
  Lists extends SanityLiteral<string>,
  InlineTypes extends (
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>
  )[],
  Decorators extends SanityLiteral<string>,
  Annotations extends (
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>
  )[],
> = {
  styles: Styles[]
  lists: Lists[]
  decorators: Decorators[]
  inlineTypes: InlineTypes
  annotations: Annotations
}

export function block<
  Styles extends SanityLiteral<string>,
  Lists extends SanityLiteral<string>,
  InlineTypes extends (
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>
  )[],
  Decorators extends SanityLiteral<string>,
  Annotations extends (
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>
  )[],
>(
  options: BlockOptions<Styles, Lists, InlineTypes, Decorators, Annotations>,
): SanityBlock<
  BlockObjectShape<Styles, Lists, InlineTypes, Decorators, Annotations>
> {
  return defineType({
    typeName: 'block',
    shape: {
      _type: literal('block'),
      style: optional(union([...options.styles])),
      level: optional(number()),
      listType: optional(union([...options.lists])),
      children: array(
        union([
          ...options.inlineTypes,
          object({
            _type: literal('span'),
            marks: array(union([...options.decorators, _markDefRef()])),
            text: string(),
          }),
        ]),
      ),
      markDefs: array(union([...options.annotations])),
    },
  }) as any
}
