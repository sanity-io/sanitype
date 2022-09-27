export interface Schema<Def = any, Output = any> {
  type: string
  def: Def
  output: Output
}

export type Shape<T> = {[key in keyof T]: Schema<T[key]>}

export interface PrimitiveSchema<
  Def extends boolean | string | number = boolean | string | number,
  Output = Def,
> extends Schema<Def, Output> {
  type: "primitive"
}

export interface LiteralSchema<
  Def extends boolean | string | number = boolean | string | number,
  Output = any,
> extends Schema<Def, Output> {
  type: "literal"
}

export interface ObjectSchema<
  Def extends Shape<any> = Shape<any>,
  Output extends any = any,
> extends Schema<Def, Output> {
  type: "object"
}

export interface PrimitiveArraySchema<
  Def extends PrimitiveSchema | UnionSchema<any, PrimitiveSchema> =
    | PrimitiveSchema
    | UnionSchema<PrimitiveSchema>,
  Output = any,
> extends Schema<Def, Output> {
  type: "primitiveArray"
}

export interface ObjectArraySchema<
  Def extends ObjectSchema | UnionSchema<ObjectSchema> =
    | ObjectSchema
    | UnionSchema<ObjectSchema>,
  Output = any,
> extends Schema<Def, Output> {
  type: "objectArray"
}

export interface UnionSchema<
  Def extends Schema<any> = Schema<any>,
  Output = any,
> extends Schema<Def, Output> {
  type: "union"
}
type InferFromShape<T extends Shape<any>> = T extends Shape<any>
  ? {
      [key in keyof T]: Infer<T[key]>
    }
  : never

export type Infer<T extends Schema<any>> = T extends ObjectSchema<infer Def>
  ? {[key in keyof Def]: Infer<Def[key]>}
  : T extends PrimitiveArraySchema<infer Def>
  ? Infer<Def>[]
  : T extends ObjectArraySchema<infer Def>
  ? (Infer<Def> & {_key: string})[]
  : T extends PrimitiveSchema<infer Def> | LiteralSchema<infer Def>
  ? Def
  : T extends UnionSchema<infer Def>
  ? Infer<Def>
  : never

export declare function union<Def extends Schema>(
  shapes: Def[],
): UnionSchema<Def>

export declare function object<Def extends Shape<any>>(
  shape: Def,
): ObjectSchema<Def>

export declare function objectArray<
  Def extends ObjectSchema | UnionSchema<ObjectSchema>,
>(elementSchema: Def): ObjectArraySchema<Def>

export declare function primitiveArray<
  Def extends PrimitiveSchema | UnionSchema<PrimitiveSchema>,
>(elementSchema: Def): PrimitiveArraySchema<Def>

export declare interface ArrayCreator {
  <Def extends ObjectSchema | UnionSchema<ObjectSchema>>(
    elementSchema: Def,
  ): ObjectArraySchema<Def>
  <Def extends PrimitiveSchema | UnionSchema<PrimitiveSchema>>(
    elementSchema: Def,
  ): PrimitiveArraySchema<Def>
}

export declare const array: ArrayCreator

export declare function string<Def extends string>(): PrimitiveSchema<string>
export declare function literal<Def extends boolean | number | string>(
  literal: Def,
): LiteralSchema<Def>

export declare function number<Def extends number>(): PrimitiveSchema<Def>
export declare function boolean<Def extends boolean>(): PrimitiveSchema<Def>

export declare function parse<T extends Schema<any>>(
  schema: T,
  input: unknown,
): Infer<T>
