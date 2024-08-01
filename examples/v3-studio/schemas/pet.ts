import {image, object, string} from '@sanity/sanitype'

export const pet = object({
  name: string(),
  image: image({caption: string()}),
})
