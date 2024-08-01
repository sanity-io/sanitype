import {type SanityFile, type SanityObjectShape} from '../defs'
import {defineType} from '../helpers/defineType'
import {fileBase, type SanityFileShape} from '../shapeDefs'

// TODO: Make `shape` optional.
export function file<Shape extends SanityObjectShape = SanityObjectShape>(
  shape: Shape,
): SanityFile<Shape & SanityFileShape> {
  return defineType({
    typeName: 'file',
    shape: {...fileBase.shape, ...shape},
  })
}
