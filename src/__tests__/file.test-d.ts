import {describe, expectTypeOf, test} from 'vitest'

import {file, string} from '../creators'
import {
  type Infer,
  type INTERNAL_REF_TYPE_SCHEMA,
  type SanityDocument,
} from '../defs'
import {type FileAssetShape} from '../shapeDefs'

describe('file type', () => {
  test('plain file type definition', () => {
    const fileSchema = file({})

    type FileValue = {
      _type: 'file'
      asset: {
        _type: 'reference'
        _ref: string
        _weak?: boolean
        [INTERNAL_REF_TYPE_SCHEMA]: SanityDocument<FileAssetShape>
      }
    }

    expectTypeOf<Infer<typeof fileSchema>>().toEqualTypeOf<FileValue>()
  })
  test('custom file type definition', () => {
    const fileSchema = file({
      caption: string(),
    })

    type FileValue = {
      _type: 'file'
      asset: {
        _type: 'reference'
        _ref: string
        _weak?: boolean
        [INTERNAL_REF_TYPE_SCHEMA]: SanityDocument<FileAssetShape>
      }
      caption: string
    }

    expectTypeOf<Infer<typeof fileSchema>>().toEqualTypeOf<FileValue>()
  })
})
