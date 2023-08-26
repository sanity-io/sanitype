import {object} from './creators'
import type {SanityObject, SanityObjectShape} from './defs'
import type {GetShapeOf} from './utils/utilTypes'

export function extend<
  O1 extends SanityObject,
  Shape2 extends SanityObjectShape,
>(source: O1, shape2: Shape2): SanityObject<GetShapeOf<O1> & Shape2> {
  return object({...source.shape, ...shape2}) as any
}
