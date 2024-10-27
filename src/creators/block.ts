import {
  type SanityBlock,
  type SanityLiteral,
  type SanityNever,
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
import {array} from './array'
import {literal} from './literal'
import {never} from './never'
import {number} from './number'
import {object} from './object'
import {optional} from './optional'
import {string} from './string'
import {type FlattenUnionTypes, union} from './union'

export function _markDefRef(): SanityLiteral<`ref-${string}`> {
  return literal(`ref-$id`)
}

export type BlockObjectShape<
  StyleType extends
    | SanityNever
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>>,
  ListType extends
    | SanityNever
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>>,
  InlineType extends
    | SanityNever
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>,
  DecoratorType extends
    | SanityNever
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>>,
  AnnotationType extends
    | SanityNever
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>,
  TypeName extends SanityLiteral<string> = SanityLiteral<'block'>,
> = {
  _type: TypeName
  style: StyleType
  level: SanityOptional<SanityNumber>
  listType: ListType
  children: SanityObjectArray<
    SanityObjectUnion<
      | FlattenUnionTypes<InlineType>
      | SanityObject<{
          _type: SanityLiteral<'span'>
          marks: SanityPrimitiveArray<
            DecoratorType | SanityLiteral<`ref-${string}`>
          >
          text: SanityString
        }>
    >
  >
  markDefs: SanityObjectArray<Exclude<AnnotationType, SanityNever>>
}

export type BlockOptions<
  StyleType extends
    | void
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>> = never,
  ListType extends
    | void
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>> = never,
  InlineType extends
    | void
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject> = never,
  DecoratorType extends
    | void
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>> = never,
  AnnotationType extends
    | void
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject> = never,
  TypeName extends SanityLiteral<string> = SanityLiteral<'block'>,
> = {
  _type?: TypeName
  style?: StyleType
  list?: ListType
  decorator?: DecoratorType
  inline?: InlineType
  annotation?: AnnotationType
}

export type VoidNever<T> = void extends T ? SanityNever : Exclude<T, void>

export function block<
  StyleType extends
    | void
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>>,
  ListType extends
    | void
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>>,
  InlineType extends
    | void
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>,
  DecoratorType extends
    | void
    | SanityLiteral<string>
    | SanityPrimitiveUnion<SanityLiteral<string>>,
  AnnotationType extends
    | void
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>,
  TypeName extends SanityLiteral<string> = SanityLiteral<'block'>,
>(
  options: BlockOptions<
    StyleType,
    ListType,
    InlineType,
    DecoratorType,
    AnnotationType,
    TypeName
  >,
): SanityBlock<
  BlockObjectShape<
    VoidNever<StyleType>,
    VoidNever<ListType>,
    VoidNever<InlineType>,
    VoidNever<DecoratorType>,
    VoidNever<AnnotationType>,
    TypeName
  >
> {
  const markDefRefSchema = _markDefRef()
  const marksSchema = options.decorator
    ? array(union([options.decorator, markDefRefSchema]))
    : array(markDefRefSchema)

  const spanType = object({
    _type: literal('span'),
    marks: marksSchema,
    text: string(),
  })
  return defineType({
    typeName: 'block',
    shape: {
      _type: options._type || literal('block'),
      ...(options.style ? {style: optional(options.style)} : {}),
      level: optional(number()),
      ...(options.list ? {list: optional(options.list)} : {}),
      children: array(union([spanType, options.inline || never()])),
      ...(options.annotation ? {markDefs: array(options.annotation)} : {}),
    },
  }) as any
}
