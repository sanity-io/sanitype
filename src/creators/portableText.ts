import {
  type SanityBlock,
  type SanityNever,
  type SanityObjectUnion,
  type SanityTypedObject,
} from '../defs'
import {array} from './array'
import {union} from './union'

export function portableText<
  const BlockType extends SanityBlock,
  const ElementType extends
    | SanityTypedObject
    | SanityObjectUnion<SanityTypedObject>
    | SanityNever,
>(options: {block: BlockType; element: ElementType}) {
  return array(union([options.block, options.element]))
}
