---
outline: deep
---

# Basic schema

```ts
import {array, document, image, literal, string} from '@sanity/sanitype'

const movieSchema = document({
  _type: literal('movie'),
  title: string(),
  poster: image({}),
  directors: array(string()),
})

```