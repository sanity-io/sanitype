# Portable Text

```ts twoslash
import * as s from '@sanity/sanitype'

const myPTArray = s.array(
  s.block({
    _type: s.literal('someBlock'),
    style: s.union([s.literal('normal'), s.literal('h1'), s.literal('h2')]),
    list: s.union([s.literal('bullet'), s.literal('number')]),
    inline: s.union([
      s.object({
        _type: s.literal('author'),
        name: s.string(),
      }),
    ]),
    decorator: s.union([s.literal('strong'), s.literal('em')]),
    annotation: s.union([
      s.object({_type: s.literal('author'), foo: s.number()}),
      s.object({_type: s.literal('book'), bar: s.number()}),
    ]),
  }),
)
type MyPTArray = s.Infer<typeof myPTArray>

const myPTArrayValue = s.parse(myPTArray, [])

const element = myPTArrayValue[0]

element.children
//         ^?
```
