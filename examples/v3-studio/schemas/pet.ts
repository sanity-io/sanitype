import {image, object, string} from 'sanitype'

export const pet = object({
  name: string(),
  image: image({caption: string()}),
})
