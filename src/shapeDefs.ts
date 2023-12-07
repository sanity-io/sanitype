import {
  boolean,
  document,
  literal,
  number,
  object,
  optional,
  reference,
  string,
} from './creators'
import {defineType as dt} from './helpers/defineType'
import type {
  Conceal,
  Infer,
  OutputFromShape,
  SanityBoolean,
  SanityLiteral,
  SanityObject,
  SanityObjectShape,
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
  _type: SanityString | SanityLiteral<'reference'>
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

export type SanityImageShape = SanityObjectShape & {
  _type: SanityLiteral<'image'>
  asset: SanityReference<typeof imageAsset>
}

export const assetSourceSpec = object({
  id: string(),
  name: string(),
  url: optional(string()),
})

const assetBase = {
  url: string(),
  path: string(),
  assetId: string(),
  extension: string(),
  mimeType: string(),
  sha1hash: string(),
  size: number(),
  originalFilename: optional(string()),

  // Extensions
  label: optional(string()),
  title: optional(string()),
  description: optional(string()),

  // External asset source extensions
  creditLine: optional(string()),
  source: optional(assetSourceSpec),
}

export const imageDimensions = object({
  _type: literal('sanity.imageDimensions'),
  height: number(),
  width: number(),
  aspectRatio: number(),
})

export const imageSwatch = object({
  _type: literal('sanity.imagePaletteSwatch'),
  background: string(),
  foreground: string(),
  population: number(),
  title: optional(string()),
})

export const imagePalette = object({
  _type: literal('sanity.imagePalette'),
  darkMuted: optional(imageSwatch),
  darkVibrant: optional(imageSwatch),
  dominant: optional(imageSwatch),
  lightMuted: optional(imageSwatch),
  lightVibrant: optional(imageSwatch),
  muted: optional(imageSwatch),
  vibrant: optional(imageSwatch),
})

export const imageMetadata = object({
  _type: literal('sanity.imageMetadata'),
  dimensions: imageDimensions,
  palette: optional(imagePalette),
  lqip: optional(string()),
  blurHash: optional(string()),
  hasAlpha: boolean(),
  isOpaque: boolean(),
})

export const imageAsset = document({
  ...assetBase,
  _type: literal('sanity.imageAsset'),
  metadata: imageMetadata,
})

export const fileAsset = document({
  ...assetBase,
  _type: literal('sanity.fileAsset'),
})

const IMAGE_LITERAL: SanityLiteral<'image'> = dt({
  typeName: 'literal',
  value: 'image',
})

export const imageBase: SanityObject<SanityImageShape> = dt({
  typeName: 'object',
  shape: {
    _type: IMAGE_LITERAL,
    asset: reference(imageAsset),
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
