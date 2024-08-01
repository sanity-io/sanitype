import {
  type SanityBlock,
  type SanityLiteral,
  type SanityNumber,
  type SanityObject,
  type SanityObjectArray,
  type SanityObjectUnion,
  type SanityOptional,
  type SanityPrimitiveArray,
  type SanityPrimitiveUnion,
  type SanityString,
  type SanityTypedObject,
} from '../defs'
import {defineType} from '../helpers/defineType'
import {type ElementType} from '../helpers/utilTypes'
import {array} from './array'
import {literal} from './literal'
import {number} from './number'
import {object} from './object'
import {optional} from './optional'
import {string} from './string'
import {type FlattenUnionTypes, union} from './union'

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
  TypeName extends SanityLiteral<string>,
> = {
  _type: TypeName
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
  TypeName extends SanityLiteral<string> = SanityLiteral<'block'>,
> = {
  _type?: TypeName
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
  TypeName extends SanityLiteral<string> = SanityLiteral<'block'>,
>(
  options: BlockOptions<
    Styles,
    Lists,
    InlineTypes,
    Decorators,
    Annotations,
    TypeName
  >,
): SanityBlock<
  BlockObjectShape<
    Styles,
    Lists,
    InlineTypes,
    Decorators,
    Annotations,
    TypeName
  >
> {
  return defineType({
    typeName: 'block',
    shape: {
      _type: options._type || literal('block'),
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
