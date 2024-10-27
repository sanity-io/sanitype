import {literal} from './literal'
import {number} from './number'
import {object} from './object'
import {optional} from './optional'

const _geopoint = object({
  _type: literal('geopoint'),
  lat: number(),
  lng: number(),
  alt: optional(number()),
})

export function geopoint() {
  return _geopoint
}
