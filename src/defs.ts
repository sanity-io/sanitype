import {Combine, OutputFormatFix} from "./utils.js"
import {
  ReferenceBase,
  SanityDocumentShape,
  SanityDocumentValue,
} from "./shapeDefs.js"

export interface SanityType<Output = any, Def = any> {
  typeName: string
  def: Def
  /**
   * @deprecated ** DO NOT USE ** This will throw an error if you try to access it at runtime
   */
  output: Output
}

export type SanityAny = SanityType<any, any>

export interface SanityString extends SanityType<string, string> {
  typeName: "string"
}
export interface SanityNumber extends SanityType<number, number> {
  typeName: "number"
}

export interface SanityBoolean extends SanityType<boolean, boolean> {
  typeName: "boolean"
}

export type SanityPrimitive = SanityString | SanityNumber | SanityBoolean

export interface SanityLiteral<
  Def extends boolean | string | number = boolean | string | number,
> extends SanityType<Def, Def> {
  typeName: "literal"
}

export interface SanityUnion<Def extends SanityAny, Output = OutputOf<Def>>
  extends SanityType<Output, Def[]> {
  typeName: "union"
}

export type SanityObjectShape<T = any> = {[key in keyof T]: SanityAny}

export interface SanityObject<
  Def extends SanityObjectShape = SanityObjectShape,
  Output = UndefinedOptional<OutputFromShape<Def>>,
> extends SanityType<Output, Def> {
  typeName: "object"
}

export interface SanityLazy<T extends SanityType>
  extends SanityType<OutputOf<T>> {
  typeName: "lazy"
}

export interface SanityReference<
  RefType extends SanityType<SanityDocumentValue>,
> extends SanityType<WithRefTypeDef<RefType>> {
  typeName: "reference"
  def: RefType
}

export interface SanityOptional<Def extends SanityType>
  extends SanityType<OutputOf<Def> | undefined, Def> {
  typeName: "optional"
}

type UndefinedToOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
}
type NonUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type UndefinedOptional<T> = Combine<
  NonUndefined<T>,
  UndefinedToOptional<T>
>

export type OutputFromShape<T extends SanityObjectShape> = {
  [Property in keyof T]: Infer<T[Property]>
} & OutputFormatFix

export type AddArrayKey<T> = Combine<T, {_key: string}>

export type SanityObjectLike = SanityObject | SanityReference<any>

export interface SanityObjectArray<
  ElementType extends SanityObjectLike | SanityUnion<SanityObjectLike> =
    | SanityObjectLike
    | SanityUnion<SanityObjectLike>,
  Output = AddArrayKey<OutputOf<ElementType>>[],
> extends SanityType<Output, ElementType> {
  typeName: "objectArray"
}

export interface SanityPrimitiveArray<
  ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive> =
    | SanityPrimitive
    | SanityUnion<SanityPrimitive>,
  Output = FlattenUnion<ElementType>[],
> extends SanityType<Output, ElementType> {
  typeName: "primitiveArray"
}

export type FlattenUnion<T extends SanityAny> = OutputOf<T>

export interface SanityDocument<
  Def extends SanityObjectShape = SanityObjectShape,
  Output = UndefinedOptional<OutputFromShape<SanityDocumentShape & Def>>,
> extends SanityType<Output, Def> {
  typeName: "document"
}

export const INTERNAL_REF_TYPE_SCHEMA = "__schema__" as const

export interface Conceal<T> {
  /** @deprecated - Do not use. Only exists in the type system and will throw an error if accessed at runtime. */
  [INTERNAL_REF_TYPE_SCHEMA]: T
}

export type WithRefTypeDef<RefType extends SanityType<SanityDocumentValue>> =
  Combine<ReferenceBase, Conceal<RefType>>

export type Infer<T extends any> = T extends SanityAny ? OutputOf<T> : T

export type OutputOf<T extends SanityAny> = T["output"]
