// TODO: Look into why Infer is not working for partially defined objects
// e.g. SanityObject<{_type: SanityLiteral<'foo'>, bar: SanityLiteral<string>}>
// import {union} from './union'
// import {array} from './array'
// import {block} from './block'
// import {literal} from './literal'
// import {object} from './object'
// import {string} from './string'
// import type {BlockOptions} from './block'
// import type {
//   Infer,
//   SanityLiteral,
//   SanityObjectLike,
//   SanityObjectUnion,
//   SanityTypedObject,
// } from '../defs'
//
// export interface PortableTextOptions<
//   ElementType extends (
//     | SanityTypedObject
//     | SanityObjectUnion<SanityTypedObject>
//   )[],
//   Styles extends SanityLiteral<string>,
//   Lists extends SanityLiteral<string>,
//   Marks extends SanityLiteral<string>,
//   InlineTypes extends (
//     | SanityTypedObject
//     | SanityObjectUnion<SanityTypedObject>
//   )[],
//   MarkDefs extends (SanityTypedObject | SanityObjectUnion<SanityTypedObject>)[],
// > extends BlockOptions<Styles, Lists, Marks, InlineTypes, MarkDefs> {
//   elementTypes: ElementType
// }
//
// export function portableText<
//   ElementType extends (
//     | SanityTypedObject
//     | SanityObjectUnion<SanityTypedObject>
//   )[],
//   Styles extends SanityLiteral<string>,
//   Lists extends SanityLiteral<string>,
//   Marks extends SanityLiteral<string>,
//   InlineTypes extends (
//     | SanityTypedObject
//     | SanityObjectUnion<SanityTypedObject>
//   )[],
//   MarkDefs extends (SanityTypedObject | SanityObjectUnion<SanityTypedObject>)[],
// >(
//   options: PortableTextOptions<
//     ElementType,
//     Styles,
//     Lists,
//     Marks,
//     InlineTypes,
//     MarkDefs
//   >,
// ) {
//   const sanityObject = block(options)
//   return array(union([sanityObject]))
// }
//
// const pt = portableText({
//   elementTypes: [object({_type: literal('foo')})],
//   inlineTypes: [],
//   lists: [],
//   markDefs: [],
//   marks: [],
//   styles: [],
// })
