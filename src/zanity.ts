export type Shape<T> = {[key in keyof T]: Schema<T[key]>}

export interface Schema<T> {
  parse: (input: unknown) => T
}

export interface ObjectSchema<T extends Shape<any>> {
  shape: T
  parse: (input: unknown) => {[key in keyof T]: Infer<T[key]>}
}

export interface ArraySchema<
  T extends
    | Schema<number>
    | Schema<boolean>
    | Schema<string>
    | UnionSchema<T>
    | ObjectSchema<any>,
> {
  parse: (input: unknown) => Array<T>
}

export interface UnionSchema<T extends Schema<any>> {
  parse: (input: unknown) => Infer<T>
}

export function union<T extends Schema<any>>(shapes: T[]): UnionSchema<T> {
  return {
    parse: input => {
      return input as any
    },
  }
}

export type Infer<T extends Schema<any>> = T extends ObjectSchema<infer O>
  ? {[key in keyof O]: Infer<O[key]>}
  : T extends ArraySchema<infer E>
  ? Infer<E>[]
  : T extends Schema<infer V>
  ? V
  : never

export function object<T extends Shape<any>>(shape: T): ObjectSchema<T> {
  return {
    shape,
    parse: input => {
      return input as any
    },
  }
}

export function array<
  T extends
    | Schema<number>
    | Schema<boolean>
    | Schema<string>
    | ObjectSchema<any>
    | UnionSchema<any>,
>(elementSchema: T): ArraySchema<T> {
  return {
    parse: input => {
      return input as any
    },
  }
}

export function string(): Schema<string> {
  return {
    parse: input => {
      if (typeof input !== "string") {
        throw new Error("Invalid type")
      }
      return input
    },
  }
}

export function number(): Schema<number> {
  return {
    parse: input => {
      if (typeof input !== "number") {
        throw new Error("Invalid type")
      }
      return input
    },
  }
}

export function boolean(): Schema<boolean> {
  return {
    parse: input => {
      if (typeof input !== "boolean") {
        throw new Error("Invalid type")
      }
      return input
    },
  }
}
