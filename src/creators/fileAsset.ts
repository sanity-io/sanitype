import {assetSourceData} from './assetSourceData'
import {document, literal, number, optional, string} from './index'

// static type definition
const _fileAsset = document({
  _type: literal('sanity.fileAsset'),
  originalFilename: optional(string()),
  label: optional(string()),
  title: optional(string()),
  description: optional(string()),
  sha1hash: string(),
  extension: string(),
  mimeType: string(),
  size: number(),
  assetId: string(),
  uploadId: string(),
  path: string(),
  url: string(),
  source: optional(assetSourceData),
})

export function fileAsset() {
  return _fileAsset
}
