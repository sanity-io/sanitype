import {Combine} from "./utils"

export interface TypeDef<Def = any, Output = any> {
  typeName: string
  def: Def
  output: Output
}

export type StringTypeDef = TypeDef<string, string>
export type NumberTypeDef = TypeDef<number, number>
export type BooleanTypeDef = TypeDef<boolean, boolean>
export type PrimitiveTypeDef = StringTypeDef | NumberTypeDef | BooleanTypeDef

export interface LiteralTypeDef<
  Def extends boolean | string | number = boolean | string | number,
> extends TypeDef<Def, Def> {
  typeName: "literal"
}

export interface UnionTypeDef<
  Def extends TypeDef = TypeDef,
  Output = OutputOf<Def>,
> extends TypeDef<Def, Output> {
  typeName: "union"
}

export type FieldsDef<T = any> = {[key in keyof T]: TypeDef}

export interface ObjectTypeDef<
  Def extends FieldsDef = FieldsDef,
  Output extends OutputFromShape<Def> = OutputFromShape<Def>,
> extends TypeDef<Def, Output> {
  typeName: "object"
}

type DocumentSchemaBase<Name extends string> = {
  _type: LiteralTypeDef<Name>
  _id: StringTypeDef
  _createdAt: StringTypeDef
  _updatedAt: StringTypeDef
  _rev: StringTypeDef
}

export interface DocumentTypeDef<
  N extends string,
  F extends FieldsDef = FieldsDef,
> extends TypeDef<F, OutputFromShape<DocumentSchemaBase<N> & F>> {
  typeName: "document"
}

type OutputFormatFix = {}

export type OutputFromShape<T extends FieldsDef> = {
  [key in keyof T]: Infer<T[key]>
} & OutputFormatFix

export interface PrimitiveArrayTypeDef<
  Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef> =
    | PrimitiveTypeDef
    | UnionTypeDef<PrimitiveTypeDef>,
  Output = FlattenUnion<Def>[],
> extends TypeDef<Def, Output> {
  typeName: "primitiveArray"
}

export interface ObjectArrayTypeDef<
  Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef> =
    | ObjectTypeDef
    | UnionTypeDef<ObjectTypeDef>,
  Output = AddArrayKey<FlattenUnion<Def>>[],
> extends TypeDef<Def, Output> {
  typeName: "objectArray"
}

type AddArrayKey<T> = Combine<T, {_key: string}>

export type ReferenceShape = {
  _type: LiteralTypeDef<"reference">
  _ref?: StringTypeDef
  _weak?: BooleanTypeDef
}

/**
 *
 * This is used to retain type information that is not accessible
 * */
export class Conceal<T> {
  /** @deprecated - Do not use. Only exists in the type system and will throw an error if accessed at runtime. */
  get "@@internal_ref_type"(): T {
    throw new Error(
      "Tried to access a concealed value that exists only in the type system",
    )
  }
}

export type Reveal<T extends Conceal<any>> = T extends Conceal<infer Concealed>
  ? Concealed
  : never

type WithRefTypeDef<RefType extends DocumentTypeDef<any>> = Combine<
  OutputFromShape<ReferenceShape>,
  Conceal<RefType>
>

export interface ReferenceTypeDef<
  RefType extends DocumentTypeDef<string>,
  Output extends WithRefTypeDef<RefType> = WithRefTypeDef<RefType>,
> extends ObjectTypeDef<ReferenceShape, Output> {
  typeName: "object"
  referenceType: RefType
}

export type Infer<T extends any> = T extends TypeDef ? OutputOf<T> : T

export type OutputOf<T extends TypeDef> = T["output"]
type FlattenUnion<T extends TypeDef> = OutputOf<T>
