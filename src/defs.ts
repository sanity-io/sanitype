import type {Combine, OutputFormatFix} from './helpers/utilTypes'
import type {
  ReferenceBase,
  SanityDocumentShape,
  SanityDocumentValue,
  SanityReferenceShape,
} from './shapeDefs'

/**
 * This file contains the core interfaces for various types. The builders defined in ./builder are implementations of these.
 */
export interface SanityType<Output = any> {
  typeName: string
  /**
   * @deprecated ** DO NOT USE ** This will throw an error if you try to access it at runtime
   */
  output: Output
}
export interface SanityObjectType<
  Output = UndefinedOptional<OutputFromShape<SanityObjectShape>>,
> extends SanityType<Output> {
  typeName: 'object'
  shape: SanityObjectShape
}

export interface SanityDocumentType<Output> extends SanityType<Output> {
  typeName: 'document'
  shape: SanityObjectShape
}

export type SanityAny = SanityType

export interface SanityString extends SanityType<string> {
  typeName: 'string'
}
export interface SanityNumber extends SanityType<number> {
  typeName: 'number'
}

export interface SanityBoolean extends SanityType<boolean> {
  typeName: 'boolean'
}

export type SanityPrimitive = SanityString | SanityNumber | SanityBoolean

export interface SanityLiteral<
  Def extends boolean | string | number = boolean | string | number,
> extends SanityType<Def> {
  typeName: 'literal'
  value: Def
}

export interface SanityObjectUnion<
  Def extends SanityTypedObject | SanityReference | SanityBlock =
    | SanityTypedObject
    | SanityReference
    | SanityBlock,
  Output = OutputOf<Def>,
> extends SanityType<Output> {
  typeName: 'union'
  union: Def[]
}
export interface SanityPrimitiveUnion<
  Def extends SanityPrimitive | SanityLiteral = SanityPrimitive | SanityLiteral,
  Output = OutputOf<Def>,
> extends SanityType<Output> {
  typeName: 'primitiveUnion'
  union: Def[]
}

export type SanityObjectShape = {[key: string]: SanityAny}
export type SanityNamedObjectShape = {
  _type: SanityLiteral
  [key: string]: SanityAny
}

export interface SanityObject<
  Shape extends SanityObjectShape = SanityObjectShape,
  // @verify!
  Output extends UndefinedOptional<OutputFromShape<Shape>> = UndefinedOptional<
    OutputFromShape<Shape>
  >,
> extends SanityType<Output> {
  typeName: 'object'
  shape: Shape
}

export interface SanityBlock<
  Shape extends SanityNamedObjectShape = SanityNamedObjectShape,
  // @verify!
  Output extends UndefinedOptional<OutputFromShape<Shape>> = UndefinedOptional<
    OutputFromShape<Shape>
  >,
> extends SanityType<Output> {
  typeName: 'block'
  shape: Shape
}

export interface SanityLazy<T extends SanityType>
  extends SanityType<OutputOf<T>> {
  typeName: 'lazy'
  get: () => T
}

export interface SanityReference<
  RefType extends
    SanityType<SanityDocumentValue> = SanityType<SanityDocumentValue>,
> extends SanityType<WithRefTypeDef<RefType>> {
  typeName: 'reference'
  referenceType: RefType

  shape: SanityReferenceShape
}

export interface SanityOptional<Type extends SanityType>
  extends SanityType<OutputOf<Type> | undefined> {
  typeName: 'optional'
  type: Type
}

export type UndefinedToOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
}
export type NonUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type UndefinedOptional<T> = Combine<
  NonUndefined<T>,
  UndefinedToOptional<T>
>

export type OutputFromShape<T extends SanityObjectShape> = {
  [Property in keyof T]: Infer<T[Property]>
}

export type AddArrayKey<T> = Combine<T, {_key: string}>

export type SanityObjectLike =
  | SanityObject
  | SanityBlock
  | SanityReference<any>
  | SanityDocument

export type SanityTypedObject = SanityObjectType<{_type: string}>

export type SanityArray<
  ElementType extends
    | (SanityObjectLike | SanityObjectUnion)
    | (SanityPrimitive | SanityPrimitiveUnion),
> = ElementType extends SanityObjectLike | SanityObjectUnion
  ? SanityObjectArray<ElementType>
  : ElementType extends SanityPrimitive | SanityPrimitiveUnion
    ? SanityPrimitiveArray<ElementType>
    : never
export interface SanityObjectArray<
  ElementType extends SanityObjectLike | SanityObjectUnion =
    | SanityObjectLike
    | SanityObjectUnion,
  Output = AddArrayKey<OutputOf<ElementType>>[],
> extends SanityType<Output> {
  typeName: 'objectArray'
  element: ElementType
}

export interface SanityPrimitiveArray<
  ElementType extends SanityPrimitive | SanityLiteral | SanityPrimitiveUnion =
    | SanityPrimitive
    | SanityLiteral
    | SanityPrimitiveUnion,
  Output = OutputOf<ElementType>[],
> extends SanityType<Output> {
  typeName: 'primitiveArray'
  element: ElementType
}

export interface _SanityDocument<
  Shape extends SanityDocumentShape = SanityDocumentShape,
  Output = UndefinedOptional<OutputFromShape<Shape>>,
> extends SanityType<Output> {
  typeName: 'document'
  shape: Shape
}

export type SanityDocument<
  Shape extends SanityObjectShape = SanityObjectShape,
  Output = UndefinedOptional<OutputFromShape<Shape>>,
> = _SanityDocument<SanityDocumentShape & Shape, Output>

export const INTERNAL_REF_TYPE_SCHEMA = '__schema__' as const

export interface Conceal<T> {
  /** @deprecated - Do not use. Only exists in the type system and will throw an error if accessed at runtime. */
  [INTERNAL_REF_TYPE_SCHEMA]: T
}

export type WithRefTypeDef<RefType extends SanityType<SanityDocumentValue>> =
  Combine<ReferenceBase, Conceal<RefType>>

export type Infer<T> = T extends () => infer R
  ? Infer<R>
  : T extends SanityAny
    ? OutputOf<T>
    : T

export type LiteralKeys<T extends SanityObjectShape> = {
  [K in keyof T as T[K] extends SanityLiteral | SanityObject | SanityDocument
    ? K
    : never]: InferLiteralValue<T[K]>
} & OutputFormatFix

export type InferDeepLiteralValue<T extends SanityObjectShape> =
  LiteralKeys<T> & OutputFormatFix

export type InferLiteralValue<T extends SanityAny> = T extends SanityLiteral<
  infer Literal
>
  ? Literal
  : T extends SanityObject<infer Shape>
    ? InferDeepLiteralValue<Shape>
    : T extends SanityDocument<infer Shape>
      ? InferDeepLiteralValue<Shape>
      : never

export type OutputOf<T extends SanityAny> = T['output']
