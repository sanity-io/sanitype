import {object} from './creators'
import type {SafeObject} from './creators'
import type {
  OutputFromShape,
  OutputOf,
  SanityObject,
  SanityObjectShape,
  SanityObjectType,
} from './defs'

export function extend<
  O1 extends SanityObject,
  Shape extends SafeObject<Shape, '_type'> = SanityObjectShape,
>(
  source: O1,
  shape2: Shape,
): SanityObjectType<OutputOf<O1> & OutputFromShape<Shape>> {
  return object({...source.shape, ...shape2}) as any
}
