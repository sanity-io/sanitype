import {defineNonEnumerableGetter} from './defineNonEnumerableGetter'

/**
 *@internal
 * defineType
 * @param target
 */
export function defineType<T>(target: T): T & {output: never} {
  return defineNonEnumerableGetter(target, 'output', () => {
    return undefined
  }) as T & {output: never}
}
