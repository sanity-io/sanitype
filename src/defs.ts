import {Merge} from "./utils"

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

export type Shape<T> = {[key in keyof T]: T[key]}

export interface ObjectTypeDef<
  Def extends Shape<any> = Shape<any>,
  Output extends OutputFromShape<Def> = OutputFromShape<Def>,
> extends TypeDef<Def, Output> {
  typeName: "object"
}

export type OutputFromShape<T extends Shape<any>> = T extends Shape<any>
  ? {
      [key in keyof T]: Infer<T[key]>
    }
  : never

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

type AddArrayKey<T> = Merge<T, {_key: string}>

export type ReferenceShape = {
  _type: LiteralTypeDef<"reference">
  _ref?: StringTypeDef
  _weak?: BooleanTypeDef
}

type AttachInternalRefTypeDef<T, RefTypeDef> = Merge<
  T,
  {
    /** @internal */
    readonly __internal_refTypeDef: RefTypeDef
  }
>

export interface ReferenceTypeDef<
  RefType extends ObjectTypeDef,
  Output extends AttachInternalRefTypeDef<
    OutputFromShape<ReferenceShape>,
    RefType
  > = AttachInternalRefTypeDef<OutputFromShape<ReferenceShape>, RefType>,
> extends ObjectTypeDef<ReferenceShape, Output> {
  typeName: "object"
  referenceType: RefType
}

export type Infer<T extends any> = T extends TypeDef ? OutputOf<T> : T

type OutputOf<T extends TypeDef> = T["output"]
type FlattenUnion<T extends TypeDef> = OutputOf<T>
