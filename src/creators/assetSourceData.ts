import {literal} from './literal'
import {object} from './object'
import {optional} from './optional'
import {string} from './string'

/**
 * @internal
 */
export const assetSourceData = object({
  _type: literal('sanity.assetSourceData'),
  name: optional(string()),
  id: optional(string()),
  url: optional(string()),
})
