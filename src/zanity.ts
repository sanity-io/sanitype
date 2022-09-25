export interface Schema<T> {
  type: string
  parse: (input: unknown) => T
}

export type Shape<T> = {[key in keyof T]: Schema<T[key]>}

export interface PrimitiveSchema<T extends boolean | string | number> {
  type: "primitive"
  parse: (input: unknown) => T
}

export interface ObjectSchema<T extends Shape<any>> {
  type: "object"
  shape: T
  parse: (input: unknown) => {[key in keyof T]: Infer<T[key]>}
}

export interface ArraySchema<
  T extends PrimitiveSchema<any> | UnionSchema<T> | ObjectSchema<any>,
> {
  type: "array"
  parse: (input: unknown) => Array<T>
}

export interface UnionSchema<T extends Schema<any>> {
  type: "union"
  parse: (input: unknown) => Infer<T>
}

export type Infer<T extends Schema<any>> = T extends ObjectSchema<infer O>
  ? {[key in keyof O]: Infer<O[key]>}
  : T extends ArraySchema<infer E>
  ? Infer<E>[]
  : T extends PrimitiveSchema<infer V>
  ? V
  : T extends UnionSchema<infer V>
  ? Infer<V>
  : never

export declare function union<T extends Schema<any>>(
  shapes: T[],
): UnionSchema<T>

export declare function object<T extends Shape<any>>(shape: T): ObjectSchema<T>
export declare function array<
  T extends PrimitiveSchema<any> | ObjectSchema<any> | UnionSchema<any>,
>(elementSchema: T): ArraySchema<T>

export declare function string(): PrimitiveSchema<string>
export declare function number(): PrimitiveSchema<number>
export declare function boolean(): PrimitiveSchema<boolean>
