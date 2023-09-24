import type {Combine} from './helpers/utilTypes'
import type {MergeObject} from './helpers/utilTypes'
import type {SafeObject} from './creators'
import type {
  OutputFromShape,
  OutputOf,
  SanityDocument,
  SanityDocumentType,
  SanityObject,
  SanityObjectShape,
  SanityObjectType,
} from './defs'

export function extend<
  Doc extends SanityDocument,
  Shape extends SafeObject<SanityObjectShape>,
>(
  source: Doc,
  shape: Shape,
): SanityDocumentType<Combine<OutputOf<Doc>, OutputFromShape<Shape>>>
export function extend<
  Obj extends SanityObject,
  Shape extends SafeObject<SanityObjectShape>,
>(
  source: Obj,
  shape: Shape,
): SanityObjectType<Combine<OutputOf<Obj>, OutputFromShape<Shape>>>
export function extend<
  Obj extends SanityObject | SanityDocument,
  Shape extends SafeObject<SanityObjectShape>,
>(source: Obj, shape: Shape) {
  return {...source, shape: {...source.shape, ...shape}}
}
