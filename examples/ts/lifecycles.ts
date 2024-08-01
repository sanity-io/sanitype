import {
  boolean,
  document,
  literal,
  number,
  object,
  optional,
  parse,
  string,
  union,
} from '@sanity/sanitype'
import {draft, stored} from '../../src/lifecycle'

const doc = document({
  _type: literal('pet'),
  name: string(),
  union: union([string(), number()]),
  opt: optional(boolean()),
  nested: object({
    foo: optional(string()),
  }),
})

const storedDoc = parse(stored(doc), {})

const draftDoc = draft(doc)

const parsedDraft = parse(draftDoc, {})

const parsedStoredDraft = parse(stored(draftDoc), {})
