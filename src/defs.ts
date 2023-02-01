import {boolean, lazy, literal, object, optional, string} from "./factories.js"
import {Combine} from "./utils.js"

export interface SanityType<Output = any, Def = any> {
  typeName: string
  def: Def
  /**
   * @deprecated ** DO NOT USE ** This will throw an error if you try to access it at runtime
   */
  output: Output
}

export type SanityAny = SanityType<any, any>
export type SanityString = SanityType<string, string>
export type SanityNumber = SanityType<number, number>
export type SanityBoolean = SanityType<boolean, boolean>

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
  Output = OutputFromShape<Def>,
> extends SanityType<Output, Def> {
  typeName: "object"
}

export interface SanityLazy<T extends SanityType>
  extends SanityType<OutputOf<T>> {
  typeName: "lazy"
}

export interface SanityReference<
  RefType extends SanityType<SanityDocumentValue>,
  Output extends WithRefTypeDef<RefType> = WithRefTypeDef<RefType>,
> extends SanityType<Output> {
  typeName: "reference"
  referenceType: RefType
}

export interface SanityOptional<Def extends SanityType>
  extends SanityType<OutputOf<Def> | undefined, Def> {
  typeName: "optional"
}

type OutputFormatFix = {}
export type OutputFromShape<T extends SanityObjectShape> = {
  [key in keyof T]: Infer<T[key]>
} & OutputFormatFix

type AddArrayKey<T> = Combine<T, {_key: string}>

type SanityObjectLike =
  | SanityObject
  | SanityUnion<SanityObject>
  | SanityReference<any>

export interface SanityObjectArray<
  ElementType extends SanityObjectLike = SanityObjectLike,
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

type FlattenUnion<T extends SanityAny> = OutputOf<T>

export const referenceBase = object({
  _type: literal("reference"),
  _ref: string(),
  _weak: optional(boolean()),
})

export type ReferenceValue = Infer<typeof referenceBase>

export const documentBase = object({
  _type: string(),
  _id: string(),
  _createdAt: string(),
  _updatedAt: string(),
  _rev: string(),
})

export type SanityDocumentShape<Name extends string = string> = {
  _type: SanityLiteral<Name>
  _id: SanityString
  _createdAt: SanityString
  _updatedAt: SanityString
  _rev: SanityString
}
export type SanityDocument<
  Name extends string = string,
  Shape extends SanityObjectShape = SanityObjectShape,
> = SanityObject<Combine<SanityDocumentShape<Name>, Shape>>

export type SanityDocumentValue = OutputFromShape<SanityDocumentShape>

export const INTERNAL_REF_TYPE_SCHEMA = "__schema__" as const

export interface Conceal<T> {
  /** @deprecated - Do not use. Only exists in the type system and will throw an error if accessed at runtime. */
  [INTERNAL_REF_TYPE_SCHEMA]: T
}

type WithRefTypeDef<RefType extends SanityType<SanityDocumentValue>> = Combine<
  ReferenceValue,
  Conceal<RefType>
>

export type Infer<T extends any> = T extends SanityAny ? OutputOf<T> : T

export type OutputOf<T extends SanityAny> = T["output"]
