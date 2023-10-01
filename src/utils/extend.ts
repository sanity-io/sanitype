import type {Combine} from '../helpers/utilTypes'
import type {SafeObject} from '../creators'
import type {
  OutputFromShape,
  SanityDocument,
  SanityDocumentType,
  SanityObject,
  SanityObjectShape,
  SanityObjectType,
} from '../defs'

export type Extends<
  Obj extends SanityObjectType | SanityDocumentType<any>,
  Shape extends SafeObject<SanityObjectShape>,
> = Obj extends SanityObjectType<infer Output>
  ? SanityObjectType<Combine<Output, OutputFromShape<Shape>>>
  : Obj extends SanityObjectType<infer Output>
  ? SanityObject<Combine<Output, Shape>>
  : never

export function extend<
  Obj extends SanityObject | SanityDocument,
  Shape extends SafeObject<SanityObjectShape>,
>(source: Obj, shape: Shape): Extends<Obj, Shape> {
  return {...source, shape: {...source.shape, ...shape}} as any
}
