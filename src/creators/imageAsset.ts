import {assetSourceData} from './assetSourceData'
import {geopoint} from './geopoint'
import {
  boolean,
  document,
  literal,
  number,
  object,
  optional,
  string,
} from './index'

const imageDimensions = object({
  _type: literal('sanity.imageDimensions'),
  height: optional(number()),
  width: optional(number()),
  aspectRatio: optional(number()),
})

const imagePaletteSwatch = object({
  _type: literal('sanity.imagePaletteSwatch'),
  background: optional(string()),
  foreground: optional(string()),
  population: optional(number()),
  title: optional(string()),
})

const imagePalette = object({
  _type: literal('sanity.imagePalette'),
  darkMuted: imagePaletteSwatch,
  lightVibrant: imagePaletteSwatch,
  darkVibrant: imagePaletteSwatch,
  vibrant: imagePaletteSwatch,
  dominant: imagePaletteSwatch,
  lightMuted: imagePaletteSwatch,
  muted: imagePaletteSwatch,
})

const imageMetadata = object({
  _type: literal('sanity.imageMetadata'),
  location: optional(geopoint()),
  dimensions: imageDimensions,
  palette: imagePalette,
  lqip: string(),
  blurHash: string(),
  hasAlpha: boolean(),
  isOpaque: boolean(),
})

const _imageAsset = document({
  _type: literal('sanity.imageAsset'),
  originalFilename: optional(string()),
  label: optional(string()),
  title: optional(string()),
  description: optional(string()),
  altText: optional(string()),
  sha1hash: string(),
  extension: string(),
  mimeType: string(),
  size: number(),
  assetId: string(),
  uploadId: string(),
  path: string(),
  url: string(),
  metadata: imageMetadata,
  source: optional(assetSourceData),
})

export function imageAsset() {
  return _imageAsset
}
