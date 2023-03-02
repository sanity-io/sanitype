import {defineNonEnumerableGetter} from "./defineNonEnumerableGetter"

/**
 *@internal
 * defineType
 * @param target
 */
export function defineType<T>(target: T): T & {output: never} {
  return defineNonEnumerableGetter(target, "output", () => {
    throw new Error("This method is not defined runtime")
  }) as T & {output: never}
}
