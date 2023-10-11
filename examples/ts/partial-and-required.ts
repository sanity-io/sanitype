import {
  boolean,
  deepPartial,
  document,
  literal,
  number,
  object,
  optional,
  parse,
  string,
  union,
} from 'sanitype'
import {deepRequired} from '../../src/utils/deepRequired'
import {shallowRequired} from '../../src/utils/shallowRequired'
import type {Infer} from 'sanitype'

const doc = document({
  _type: literal('pet'),
  name: string(),
  union: union([string(), number()]),
  opt: optional(boolean()),
  nested: object({
    foo: optional(string()),
  }),
})

type Doc = Infer<typeof doc>

const parsed = parse(doc, {})

const parsedPartial = parse(deepPartial(doc), {})

const parsedDeepRequired = parse(deepRequired(doc), {})

const parsedShallowRequired = parse(shallowRequired(doc), {})