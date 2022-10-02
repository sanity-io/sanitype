export type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K]
} & B extends infer O
  ? {[K in keyof O]: O[K]}
  : never

export type UnderscoreKeys<T> = {
  [K in keyof T]: K extends `_${infer S}` ? K : never
}[keyof T]

export type GroupUnderscoreKeys<T> = Merge<
  Pick<T, UnderscoreKeys<T>>,
  Omit<T, UnderscoreKeys<T>>
>
