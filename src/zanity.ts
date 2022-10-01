export interface Type<Def = any, Output = any> {
  name: string
  def: Def
  output: Output
}

export type Shape<T> = {[key in keyof T]: T[key]}

export interface PrimitiveType<
  Def extends boolean | string | number = boolean | string | number,
> extends Type<Def, Def> {
  name: "primitive"
}

export interface LiteralType<
  Def extends boolean | string | number = boolean | string | number,
> extends Type<Def, Def> {
  name: "literal"
}

export type OutputFromShape<T extends Shape<any>> = T extends Shape<any>
  ? {
      [key in keyof T]: Infer<T[key]>
    }
  : never

export type OutputOf<T extends Type> = T["output"]

export interface ObjectTypeDef<
  Def extends Shape<any> = Shape<any>,
  Output extends OutputFromShape<Def> = OutputFromShape<Def>,
> extends Type<Def, Output> {
  name: "object"
}

export type FlattenUnion<T extends Type> = OutputOf<T>

export interface PrimitiveArrayType<
  Def extends PrimitiveType | UnionType<PrimitiveType> =
    | PrimitiveType
    | UnionType<PrimitiveType>,
  Output = FlattenUnion<Def>[],
> extends Type<Def, Output> {
  name: "primitiveArray"
}

export interface ObjectArrayType<
  Def extends ObjectTypeDef | UnionType<ObjectTypeDef> =
    | ObjectTypeDef
    | UnionType<ObjectTypeDef>,
  Output = (FlattenUnion<Def> & {_key: string})[],
> extends Type<Def, Output> {
  name: "objectArray"
}

export interface UnionType<Def extends Type = Type, Output = OutputOf<Def>>
  extends Type<Def, Output> {
  name: "union"
}
export type Infer<T extends Type<any>> = OutputOf<T>

export type OutputType<Output extends any, Def extends any = any> = Type<
  Def,
  Output
>

export declare function lazy<Output extends any, T extends Type>(
  getter: () => T,
): T

export declare function union<Def extends Type>(shapes: Def[]): UnionType<Def>

export declare function object<Def extends Shape<any>>(
  shape: Def,
): ObjectTypeDef<Def>

export declare function objectArray<
  Def extends ObjectTypeDef | UnionType<ObjectTypeDef>,
>(elementSchema: Def): ObjectArrayType<Def>

export declare function primitiveArray<
  Def extends PrimitiveType | UnionType<PrimitiveType>,
>(elementSchema: Def): PrimitiveArrayType<Def>

export declare interface ArrayCreator {
  <Def extends ObjectTypeDef | UnionType<ObjectTypeDef>>(
    elementSchema: Def,
  ): ObjectArrayType<Def>
  <Def extends PrimitiveType | UnionType<PrimitiveType>>(
    elementSchema: Def,
  ): PrimitiveArrayType<Def>
}

export declare const array: ArrayCreator

export declare function string<Def extends string>(): PrimitiveType<string>
export declare function literal<Def extends boolean | number | string>(
  literal: Def,
): LiteralType<Def>

export declare function number<Def extends number>(): PrimitiveType<Def>
export declare function boolean<Def extends boolean>(): PrimitiveType<Def>

export declare function parse<T extends Type<any>>(
  schema: T,
  input: unknown,
): Infer<T>
