import {
  boolean,
  document,
  literal,
  number,
  object,
  optional,
  string,
} from '../creators'

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
  metadata: imageMetadata,
})
