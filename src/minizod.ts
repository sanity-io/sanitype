export type Shape<T> = {[key in keyof T]: Schema<T[key]>}

export interface Schema<T> {
  parse: (input: unknown) => T
}

export interface ObjectSchema<T extends Shape<any>> {
  shape: T
  parse: (input: unknown) => {[key in keyof T]: Infer<T[key]>}
}

export interface ArraySchema<T extends Schema<T>> {
  elementSchema: T
  parse: (input: unknown) => Array<Infer<T>>
}

export interface UnionSchema<T extends Schema<T[]>> {
  parse: (input: unknown) => Infer<T>
}

export type Infer<T extends Schema<any>> = T extends ObjectSchema<infer O>
  ? {[key in keyof O]: Infer<O[key]>}
  : T extends ArraySchema<infer E>
  ? E[]
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

export function array<T extends Schema<any>>(elementSchema: T): ArraySchema<T> {
  return {
    elementSchema,
    parse: input => {
      return input as any
    },
  }
}

export function union<T extends Schema<any>>(shape: T[]): UnionSchema<T> {
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
