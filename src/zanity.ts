export interface Schema<T> {
  type: string
  def: T
}

export type Shape<T> = {[key in keyof T]: Schema<T[key]>}

export interface PrimitiveSchema<T extends boolean | string | number>
  extends Schema<T> {
  type: "primitive"
}

export interface LiteralSchema<T extends boolean | string | number>
  extends Schema<T> {
  type: "literal"
}

export interface ObjectSchema<T extends Shape<any>> extends Schema<T> {
  type: "object"
}

export interface PrimitiveArraySchema<
  T extends PrimitiveSchema<any> | UnionSchema<PrimitiveSchema<any>>,
> extends Schema<T> {
  type: "primitiveArray"
}

export interface ObjectArraySchema<
  T extends ObjectSchema<any> | UnionSchema<ObjectSchema<any>>,
> extends Schema<T> {
  type: "objectArray"
}

export interface UnionSchema<T extends Schema<any>> extends Schema<T> {
  type: "union"
}

export type Infer<T extends Schema<any>> = T extends ObjectSchema<infer O>
  ? {[key in keyof O]: Infer<O[key]>}
  : T extends PrimitiveArraySchema<infer E>
  ? Infer<E>[]
  : T extends ObjectArraySchema<infer E>
  ? (Infer<E> & {_key: string})[]
  : T extends PrimitiveSchema<infer V> | LiteralSchema<infer V>
  ? V
  : T extends UnionSchema<infer V>
  ? Infer<V>
  : never

export declare function union<T extends Schema<any>>(
  shapes: T[],
): UnionSchema<T>

export declare function object<T extends Shape<any>>(shape: T): ObjectSchema<T>

export declare function objectArray<
  T extends ObjectSchema<any> | UnionSchema<ObjectSchema<any>>,
>(elementSchema: T): ObjectArraySchema<T>

export declare function primitiveArray<
  T extends PrimitiveSchema<any> | UnionSchema<PrimitiveSchema<any>>,
>(elementSchema: T): PrimitiveArraySchema<T>

export declare interface ArrayCreator {
  <T extends ObjectSchema<any> | UnionSchema<ObjectSchema<any>>>(
    elementSchema: T,
  ): ObjectArraySchema<T>
  <T extends PrimitiveSchema<any> | UnionSchema<PrimitiveSchema<any>>>(
    elementSchema: T,
  ): PrimitiveArraySchema<T>
}

export declare const array: ArrayCreator

export declare function string(): PrimitiveSchema<string>
export declare function literal<T extends boolean | number | string>(
  literal: T,
): LiteralSchema<T>
export declare function number(): PrimitiveSchema<number>
export declare function boolean(): PrimitiveSchema<boolean>

export declare function parse<T extends Schema<any>>(
  schema: T,
  input: unknown,
): Infer<T>
