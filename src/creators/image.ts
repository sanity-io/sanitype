import {type SanityImage, type SanityObjectShape} from '../defs'
import {defineType} from '../helpers/defineType'
import {imageBase, type SanityImageShape} from '../shapeDefs'

// TODO: Make `shape` optional.
export function image<Shape extends SanityObjectShape = SanityObjectShape>(
  shape: Shape,
): SanityImage<Shape & SanityImageShape> {
  return defineType({
    typeName: 'image',
    shape: {...imageBase.shape, ...shape},
  })
}
