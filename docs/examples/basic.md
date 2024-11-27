# Basic schema

```ts twoslash
import * as s from '@sanity/sanitype'

const movieSchema = s.document({
  _type: s.literal('movie'),
  title: s.string(),
  year: s.number(),
  poster: s.image({}),
  directors: s.array(s.string()),
})

type Movie = s.Infer<typeof movieSchema>

const theMartian = s.parse(movieSchema, {})
theMartian.directors
//            ^?

//…
// @errors: 2339
console.log(theMartian.year.toUpperCase()) // Error, typo
```
