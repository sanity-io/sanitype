import {type SafeObject} from '../creators'
import {
  type OutputFromShape,
  type SanityDocument,
  type SanityDocumentType,
  type SanityObject,
  type SanityObjectShape,
  type SanityObjectType,
} from '../defs'
import {type Combine} from '../helpers/utilTypes'

export type Extends<
  Obj extends SanityObject | SanityDocument,
  Augmentation extends SafeObject<SanityObjectShape>,
> =
  Obj extends SanityObject<infer Shape, infer Output>
    ? SanityObjectShape extends Shape
      ? SanityObjectType<Combine<Output, OutputFromShape<Augmentation>>>
      : SanityObject<Combine<Shape, Augmentation>>
    : Obj extends SanityDocument<infer Shape, infer Output>
      ? SanityObjectShape extends Shape
        ? SanityDocumentType<Combine<Output, OutputFromShape<Augmentation>>>
        : SanityDocument<Combine<Shape, Augmentation>>
      : never

export function extend<
  Obj extends SanityObject | SanityDocument,
  Shape extends SafeObject<SanityObjectShape>,
>(source: Obj, shape: Shape): Extends<Obj, Shape> {
  return {...source, shape: {...source.shape, ...shape}} as any
}
