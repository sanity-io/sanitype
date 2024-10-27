import {literal, number, object, optional} from '@sanity/sanitype'

const _geopoint = object({
  _type: literal('geopoint'),
  lat: number(),
  lng: number(),
  alt: optional(number()),
})

export function geopoint() {
  return _geopoint
}
