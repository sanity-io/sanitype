import {
  boolean,
  document,
  type Infer,
  literal,
  number,
  object,
  optional,
  parse,
  string,
  union,
} from '@sanity/sanitype'

const userSchema = document({
  _type: literal('user'),
  name: string(),
  union: union([string(), number()]),
  optional: optional(boolean()),
  nested: object({
    foo: optional(string()),
  }),
})

type User = Infer<typeof userSchema>

const carl = parse(userSchema, {
  _type: 'user',
  name: 'Carl',
  union: 'foo',
  optional: true,
  nested: {
    foo: 'bar',
  },
})

//@ts-expect-error - Property 'noSuchProperty' does not exist on type 'User'.
carl.noSuchProperty
