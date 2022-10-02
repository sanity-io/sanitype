import {GroupUnderscoreKeys, Merge} from "./utils"

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

export type Attributes<T = any> = {[key in keyof T]: TypeDef}

export interface ObjectTypeDef<
  Def extends Attributes = Attributes,
  Output extends OutputFromShape<Def> = OutputFromShape<Def>,
> extends TypeDef<Def, Output> {
  typeName: "object"
}

type DocumentSchemaAttrs<Name extends string> = {
  _id: StringTypeDef
  _type: LiteralTypeDef<Name>
  _createdAt: StringTypeDef
  _updatedAt: StringTypeDef
  _rev: StringTypeDef
}

export interface DocumentTypeDef<
  Name extends string,
  Attrs extends Attributes = Attributes,
> extends TypeDef<
    Attrs,
    OutputFromShape<DocumentSchemaAttrs<Name> & Attrs>
  > {
  typeName: "document"
}

export type OutputFromShape<T extends Attributes> = T extends Attributes
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

type SetInternalRefTypeDef<T, RefTypeDef extends DocumentTypeDef<any>> = Merge<
  T,
  {
    /** @internal */
    readonly __internal_refTypeDef: RefTypeDef
  }
>

export type StripInternalRefType<T> = {
  [P in keyof T]: P extends "__internal_refTypeDef" ? never : T[P]
}

export interface ReferenceTypeDef<
  RefType extends DocumentTypeDef<string>,
  Output extends SetInternalRefTypeDef<
    OutputFromShape<ReferenceShape>,
    RefType
  > = SetInternalRefTypeDef<OutputFromShape<ReferenceShape>, RefType>,
> extends ObjectTypeDef<ReferenceShape, Output> {
  typeName: "object"
  referenceType: RefType
}

export type Infer<T extends any> = T extends TypeDef ? OutputOf<T> : T

type OutputOf<T extends TypeDef> = T["output"]
type FlattenUnion<T extends TypeDef> = OutputOf<T>
