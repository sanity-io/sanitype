import {defineType as dt} from './helpers/defineType'
import type {
  Conceal,
  Infer,
  OutputFromShape,
  SanityBoolean,
  SanityDocument,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityOptional,
  SanityReference,
  SanityString,
  SanityType,
  UndefinedOptional,
} from './defs'
import type {Combine, OutputFormatFix} from './helpers/utilTypes'

const STRING: SanityString = dt({typeName: 'string', def: ''})
const OPTIONAL_STRING: SanityOptional<SanityString> = dt({
  typeName: 'optional',
  type: STRING,
})
const NUMBER: SanityNumber = dt({typeName: 'number'})
const BOOLEAN: SanityBoolean = dt({
  typeName: 'boolean',
  def: true,
})

export type SanityDocumentShape = {
  _type: SanityString | SanityLiteral<string>
  _id: SanityOptional<SanityString>
  _createdAt: SanityOptional<SanityString>
  _updatedAt: SanityOptional<SanityString>
  _rev: SanityOptional<SanityString>
}

export const documentBase: SanityObject<SanityDocumentShape> = dt({
  typeName: 'object',
  shape: {
    _type: STRING,
    _id: OPTIONAL_STRING,
    _createdAt: OPTIONAL_STRING,
    _updatedAt: OPTIONAL_STRING,
    _rev: OPTIONAL_STRING,
  },
})

export type SanityReferenceShape = {
  _type: SanityLiteral<'reference'>
  _ref: SanityString
  _weak: SanityOptional<SanityBoolean>
}

const REFERENCE_LITERAL: SanityLiteral<'reference'> = dt({
  typeName: 'literal',
  value: 'reference',
})

export const referenceBase: SanityObject<SanityReferenceShape> = dt({
  typeName: 'object',
  shape: {
    _type: REFERENCE_LITERAL,
    _ref: STRING,
    _weak: dt({typeName: 'optional' as const, type: BOOLEAN}),
  },
})

export type ReferenceBase = Infer<typeof referenceBase>

export type SanityImageShape = {
  _type: SanityLiteral<'image'>
  asset: SanityReference<SanityDocument<ImageAssetShape>>
}

export type SanityFileShape = {
  _type: SanityLiteral<'file'>
  asset: SanityReference<SanityDocument<FileAssetShape>>
}

export type AssetSourceSpecShape = {
  id: SanityString
  name: SanityString
  url: SanityOptional<SanityString>
}

const ASSET_SOURCE_SPEC: SanityObject<AssetSourceSpecShape> = dt({
  typeName: 'object',
  shape: {
    id: STRING,
    name: STRING,
    url: OPTIONAL_STRING,
  },
})

const assetBase = {
  ...documentBase.shape,
  url: STRING,
  path: STRING,
  assetId: STRING,
  extension: STRING,
  mimeType: STRING,
  sha1hash: STRING,
  size: NUMBER,
  originalFilename: OPTIONAL_STRING,

  // Extensions
  label: OPTIONAL_STRING,
  title: OPTIONAL_STRING,
  description: OPTIONAL_STRING,

  // External asset source extensions
  creditLine: OPTIONAL_STRING,
  source: dt({
    typeName: 'optional',
    type: ASSET_SOURCE_SPEC,
  }),
}

export type ImageDimensionsShape = {
  _type: SanityLiteral<'sanity.imageDimensions'>
  height: SanityNumber
  width: SanityNumber
  aspectRatio: SanityNumber
}

const IMAGE_DIMENSIONS: SanityObject<ImageDimensionsShape> = dt({
  typeName: 'object',
  shape: {
    _type: dt({
      typeName: 'literal',
      value: 'sanity.imageDimensions',
    }),
    height: NUMBER,
    width: NUMBER,
    aspectRatio: NUMBER,
  },
})

export type ImageSwatchShape = {
  _type: SanityLiteral<'sanity.imagePaletteSwatch'>
  background: SanityString
  foreground: SanityString
  population: SanityNumber
  title: SanityOptional<SanityString>
}

const IMAGE_SWATCH: SanityObject<ImageSwatchShape> = dt({
  typeName: 'object',
  shape: {
    _type: dt({
      typeName: 'literal',
      value: 'sanity.imagePaletteSwatch',
    }),
    background: STRING,
    foreground: STRING,
    population: NUMBER,
    title: OPTIONAL_STRING,
  },
})

const OPTIONAL_IMAGE_SWATCH: SanityOptional<SanityObject<ImageSwatchShape>> =
  dt({
    typeName: 'optional',
    type: IMAGE_SWATCH,
  })

export type ImagePaletteName =
  | 'darkMuted'
  | 'darkVibrant'
  | 'dominant'
  | 'lightMuted'
  | 'lightVibrant'
  | 'muted'
  | 'vibrant'

export type ImagePaletteShape = {
  _type: SanityLiteral<'sanity.imagePalette'>
} & Record<ImagePaletteName, SanityOptional<SanityObject<ImageSwatchShape>>>

const IMAGE_PALETTE: SanityObject<ImagePaletteShape> = dt({
  typeName: 'object',
  shape: {
    _type: dt({
      typeName: 'literal',
      value: 'sanity.imagePalette',
    }),
    darkMuted: OPTIONAL_IMAGE_SWATCH,
    darkVibrant: OPTIONAL_IMAGE_SWATCH,
    dominant: OPTIONAL_IMAGE_SWATCH,
    lightMuted: OPTIONAL_IMAGE_SWATCH,
    lightVibrant: OPTIONAL_IMAGE_SWATCH,
    muted: OPTIONAL_IMAGE_SWATCH,
    vibrant: OPTIONAL_IMAGE_SWATCH,
  },
})

const OPTIONAL_IMAGE_PALETTE: SanityOptional<SanityObject<ImagePaletteShape>> =
  dt({
    typeName: 'optional',
    type: IMAGE_PALETTE,
  })

export type ImageMetadataShape = {
  _type: SanityLiteral<'sanity.imageMetadata'>
  dimensions: SanityObject<ImageDimensionsShape>
  palette: SanityOptional<SanityObject<ImagePaletteShape>>
  lqip: SanityOptional<SanityString>
  blurHash: SanityOptional<SanityString>
  hasAlpha: SanityBoolean
  isOpaque: SanityBoolean
}

const IMAGE_METADATA: SanityObject<ImageMetadataShape> = dt({
  typeName: 'object',
  shape: {
    _type: dt({
      typeName: 'literal',
      value: 'sanity.imageMetadata',
    }),
    dimensions: IMAGE_DIMENSIONS,
    palette: OPTIONAL_IMAGE_PALETTE,
    lqip: OPTIONAL_STRING,
    blurHash: OPTIONAL_STRING,
    hasAlpha: BOOLEAN,
    isOpaque: BOOLEAN,
  },
})

export type ImageAssetShape = {
  _type: SanityLiteral<'sanity.imageAsset'>
  metadata: SanityObject<ImageMetadataShape>
}

export const IMAGE_ASSET: SanityDocument<ImageAssetShape> = dt({
  typeName: 'document',
  shape: {
    ...assetBase,
    _type: dt({
      typeName: 'literal',
      value: 'sanity.imageAsset',
    }),
    metadata: IMAGE_METADATA,
  },
})

export type FileAssetShape = {
  _type: SanityLiteral<'sanity.fileAsset'>
}

const FILE_ASSET: SanityDocument<FileAssetShape> = dt({
  typeName: 'document',
  shape: {
    ...assetBase,
    _type: dt({
      typeName: 'literal',
      value: 'sanity.fileAsset',
    }),
  },
})

const IMAGE_LITERAL: SanityLiteral<'image'> = dt({
  typeName: 'literal',
  value: 'image',
})

export const imageBase: SanityObject<SanityImageShape> = dt({
  typeName: 'object',
  shape: {
    _type: IMAGE_LITERAL,
    asset: dt({
      typeName: 'reference',
      referenceType: IMAGE_ASSET,
      shape: referenceBase.shape,
    }),
  },
})

const FILE_LITERAL: SanityLiteral<'file'> = dt({
  typeName: 'literal',
  value: 'file',
})

export const fileBase: SanityObject<SanityFileShape> = dt({
  typeName: 'object',
  shape: {
    _type: FILE_LITERAL,
    asset: dt({
      typeName: 'reference',
      referenceType: FILE_ASSET,
      shape: referenceBase.shape,
    }),
  },
})

export type SanityArrayValue<ElementType> = Array<
  ElementType extends object
    ? Combine<ElementType, {_key: string}>
    : ElementType
> &
  OutputFormatFix

export type SanityDocumentValue = UndefinedOptional<
  OutputFromShape<SanityDocumentShape>
>

export type SanityReferenceValue<RefType> = Combine<
  ReferenceBase,
  Conceal<SanityType<RefType>>
>
