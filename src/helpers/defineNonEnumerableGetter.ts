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
