# Basic schema

## Hello World

This might not be a super useful example, but it illustrates the basic concept of Sanitype:

```ts
import {object, string, parse} from '@sanity/sanitype'

// define your string type
const userSchema = object({
  name: string(),
})

// parse a value
const user = parse(userSchema, {name: 'Alice'})
```

```ts
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
