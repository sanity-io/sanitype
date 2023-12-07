import {defineType} from '../helpers/defineType'
import {type SanityImageShape, imageBase} from '../shapeDefs'
import type {SanityImage, SanityObjectShape} from '../defs'

export function image<Shape extends SanityObjectShape = SanityObjectShape>(
  shape: Shape,
): SanityImage<Shape & SanityImageShape> {
  return defineType({
    typeName: 'image',
    shape: {...imageBase.shape, ...shape},
  })
}