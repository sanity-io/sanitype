import {literal, object, optional, string} from './index'

/**
 * @internal
 */
export const assetSourceData = object({
  _type: literal('sanity.assetSourceData'),
  name: optional(string()),
  id: optional(string()),
  url: optional(string()),
})
