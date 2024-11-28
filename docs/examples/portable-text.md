# Portable Text

## Minimalist Portable Text

```ts twoslash
import {
  array,
  block,
  type Infer,
  literal,
  number,
  object,
  parse,
  string,
  union,
} from '@sanity/sanitype'

const minimalistPortableText = array(block({}))

type MinimalistPortableText = Infer<typeof minimalistPortableText>

const portableTextValue = parse(minimalistPortableText, [])

const element = portableTextValue[0]

// children can only contain spans
element.children

// children can only contain spans
element.style
```

## Portable Text with decorators and annotations

```ts twoslash
import {
  array,
  block,
  type Infer,
  literal,
  number,
  object,
  parse,
  string,
  union,
} from '@sanity/sanitype'
// ---cut-before---

const blockSchema = block({
  _type: literal('myBlockType'),
  style: union([literal('normal'), literal('h1'), literal('h2')]),
  list: union([literal('bullet'), literal('number')]),
  inline: union([
    object({
      _type: literal('author'),
      name: string(),
    }),
  ]),
  decorator: union([literal('strong'), literal('em')]),
  annotation: union([
    object({_type: literal('author'), foo: number()}),
    object({_type: literal('book'), bar: number()}),
  ]),
})

const portableTextSchema = array(blockSchema)

type MyPTArray = Infer<typeof portableTextSchema>

const portableTextValue = parse(portableTextSchema, [])

const element = portableTextValue[0]

element.children
```
