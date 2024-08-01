import {defineType} from '../helpers/defineType'
import {type SanityFileShape, fileBase} from '../shapeDefs'
import {type SanityFile, type SanityObjectShape} from '../defs'

// TODO: Make `shape` optional.
export function file<Shape extends SanityObjectShape = SanityObjectShape>(
  shape: Shape,
): SanityFile<Shape & SanityFileShape> {
  return defineType({
    typeName: 'file',
    shape: {...fileBase.shape, ...shape},
  })
}
