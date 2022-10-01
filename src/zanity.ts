export interface TypeDef<Def = any, Output = any> {
  name: string
  def: Def
  output: Output
}

export type Shape<T> = {[key in keyof T]: T[key]}

export type StringTypeDef = TypeDef<string, string>
export type NumberTypeDef = TypeDef<number, number>
export type BooleanTypeDef = TypeDef<boolean, boolean>

type PrimitiveTypeDef = StringTypeDef | NumberTypeDef | BooleanTypeDef

export interface LiteralTypeDef<
  Def extends boolean | string | number = boolean | string | number,
> extends TypeDef<Def, Def> {
  name: "literal"
}

export type OutputFromShape<T extends Shape<any>> = T extends Shape<any>
  ? {
      [key in keyof T]: Infer<T[key]>
    }
  : never

export type OutputOf<T extends TypeDef> = T["output"]

export interface ObjectTypeDef<
  Def extends Shape<any> = Shape<any>,
  Output extends OutputFromShape<Def> = OutputFromShape<Def>,
> extends TypeDef<Def, Output> {
  name: "object"
}

export type FlattenUnion<T extends TypeDef> = OutputOf<T>

export interface PrimitiveArrayTypeDef<
  Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef> =
    | PrimitiveTypeDef
    | UnionTypeDef<PrimitiveTypeDef>,
  Output = FlattenUnion<Def>[],
> extends TypeDef<Def, Output> {
  name: "primitiveArray"
}

export interface ObjectArrayTypeDef<
  Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef> =
    | ObjectTypeDef
    | UnionTypeDef<ObjectTypeDef>,
  Output = (FlattenUnion<Def> & {_key: string})[],
> extends TypeDef<Def, Output> {
  name: "objectArray"
}

export interface UnionTypeDef<
  Def extends TypeDef = TypeDef,
  Output = OutputOf<Def>,
> extends TypeDef<Def, Output> {
  name: "union"
}
export type Infer<T extends TypeDef<any>> = OutputOf<T>

export declare function lazy<Output extends any, T extends TypeDef>(
  getter: () => T,
): T

export declare function union<Def extends TypeDef>(
  shapes: Def[],
): UnionTypeDef<Def>

export declare function object<Def extends Shape<any>>(
  shape: Def,
): ObjectTypeDef<Def>

export declare function objectArray<
  Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef>,
>(elementSchema: Def): ObjectArrayTypeDef<Def>

export declare function primitiveArray<
  Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef>,
>(elementSchema: Def): PrimitiveArrayTypeDef<Def>

export declare interface ArrayCreator {
  <Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef>>(
    elementSchema: Def,
  ): ObjectArrayTypeDef<Def>
  <Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef>>(
    elementSchema: Def,
  ): PrimitiveArrayTypeDef<Def>
}

export declare const array: ArrayCreator

export declare function string<Def extends string>(): StringTypeDef
export declare function literal<Def extends boolean | number | string>(
  literal: Def,
): LiteralTypeDef<Def>

export declare function number<Def extends number>(): NumberTypeDef
export declare function boolean<Def extends boolean>(): BooleanTypeDef

export declare function parse<T extends TypeDef<any>>(
  schema: T,
  input: unknown,
): Infer<T>
