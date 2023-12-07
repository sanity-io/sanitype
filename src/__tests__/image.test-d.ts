import {describe, expectTypeOf, test} from 'vitest'
import {image, string} from '../creators'
import type {ImageAssetShape} from '../shapeDefs'
import type {INTERNAL_REF_TYPE_SCHEMA, Infer, SanityDocument} from '../defs'

describe('image type', () => {
  test('plain image type definition', () => {
    const imageSchema = image({})

    type ImageValue = {
      _type: 'image'
      asset: {
        _type: 'reference'
        _ref: string
        _weak?: boolean
        [INTERNAL_REF_TYPE_SCHEMA]: SanityDocument<ImageAssetShape>
      }
    }

    expectTypeOf<Infer<typeof imageSchema>>().toEqualTypeOf<ImageValue>()
  })
  test('custom image type definition', () => {
    const imageSchema = image({
      caption: string(),
    })

    type ImageValue = {
      _type: 'image'
      asset: {
        _type: 'reference'
        _ref: string
        _weak?: boolean
        [INTERNAL_REF_TYPE_SCHEMA]: SanityDocument<ImageAssetShape>
      }
      caption: string
    }

    expectTypeOf<Infer<typeof imageSchema>>().toEqualTypeOf<ImageValue>()
  })
})
