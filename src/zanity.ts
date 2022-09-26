export interface Schema<Output = any, Def = any> {
  type: string
  def: Def
  output: Output
}

export type Shape<T> = {[key in keyof T]: Schema<T[key]>}

export interface PrimitiveSchema<
  Output = any,
  Def extends boolean | string | number = boolean | string | number,
> extends Schema<Output, Def> {
  type: "primitive"
}

export interface LiteralSchema<
  Output = any,
  Def extends boolean | string | number = boolean | string | number,
> extends Schema<Output, Def> {
  type: "literal"
}

export interface ObjectSchema<Output = any, Def extends Shape<any> = Shape<any>>
  extends Schema<Output, Def> {
  type: "object"
}

export interface PrimitiveArraySchema<
  Output = any,
  Def extends PrimitiveSchema | UnionSchema<any, PrimitiveSchema> =
    | PrimitiveSchema
    | UnionSchema<any, PrimitiveSchema>,
> extends Schema<Output, Def> {
  type: "primitiveArray"
}

export interface ObjectArraySchema<
  Output = any,
  Def extends ObjectSchema | UnionSchema<any, ObjectSchema> =
    | ObjectSchema
    | UnionSchema<any, ObjectSchema>,
> extends Schema<Output, Def> {
  type: "objectArray"
}

export interface UnionSchema<
  Output = any,
  Def extends Schema<any> = Schema<any>,
> extends Schema<Output, Def> {
  type: "union"
}

export type Infer<T extends Schema<any>> = T extends ObjectSchema<
  infer Output,
  infer Def
>
  ? {[key in keyof Def]: Infer<Def[key]>}
  : T extends PrimitiveArraySchema<infer Output, infer Def>
  ? Infer<Def>[]
  : T extends ObjectArraySchema<infer Output, infer Def>
  ? (Infer<Def> & {_key: string})[]
  : T extends
      | PrimitiveSchema<infer Output, infer Def>
      | LiteralSchema<infer Output, infer Def>
  ? Def
  : T extends UnionSchema<infer Output, infer Def>
  ? Infer<Def>
  : never

export declare function union<Def extends Schema>(
  shapes: Def[],
): UnionSchema<any, Def>

export declare function object<Def extends Shape<any>>(
  shape: Def,
): ObjectSchema<any, Def>

export declare function objectArray<
  Def extends ObjectSchema<any> | UnionSchema<any, ObjectSchema<any>>,
>(elementSchema: Def): ObjectArraySchema<any, Def>

export declare function primitiveArray<
  Def extends PrimitiveSchema | UnionSchema<any, PrimitiveSchema>,
>(elementSchema: Def): PrimitiveArraySchema<any, Def>

export declare interface ArrayCreator {
  <Def extends ObjectSchema | UnionSchema<any, ObjectSchema>>(
    elementSchema: Def,
  ): ObjectArraySchema<any, Def>
  <Def extends PrimitiveSchema | UnionSchema<any, PrimitiveSchema>>(
    elementSchema: Def,
  ): PrimitiveArraySchema<any, Def>
}

export declare const array: ArrayCreator

export declare function string<Def extends string>(): PrimitiveSchema<any, Def>
export declare function literal<T extends boolean | number | string>(
  literal: T,
): LiteralSchema<any, T>

export declare function number<Def extends number>(): PrimitiveSchema<any, Def>
export declare function boolean<Def extends boolean>(): PrimitiveSchema<
  any,
  Def
>

export declare function parse<T extends Schema<any>>(
  schema: T,
  input: unknown,
): Infer<T>

export declare function lazy<Output = any, Def = any>(
  factory: () => Def,
): Schema<Def>["output"]

const f: ObjectSchema<{bar: number}> = object({foo: string()})

const p = parse(f, {})
