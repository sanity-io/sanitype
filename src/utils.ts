/**
 *  Generic utility types
 */

/**
 * Combines two object types into a single, uniform type instead of an intersection of the two
 */
export type Combine<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K]
} & B extends infer O
  ? {[K in keyof O]: O[K]}
  : never

/**
 * Extracts all keys from an object type that starts with `_`
 */
export type UnderscoreKeys<T> = {
  [K in keyof T]: K extends `_${infer S}` ? K : never
}[keyof T]

/**
 * Groups keys of an object type so that underscore keys comes first and other keys comes after
 */
export type GroupUnderscoreKeys<T> = Combine<
  Pick<T, UnderscoreKeys<T>>,
  Omit<T, UnderscoreKeys<T>>
>

export function defineNonEnumerableGetter<T, Prop extends keyof any>(
  target: T,
  name: Prop,
  getter: () => any,
): T & {[key in Prop]: any} {
  return Object.defineProperty(target, name, {
    get: getter,
    enumerable: false,
    configurable: false,
  }) as any
}
