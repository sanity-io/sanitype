import {
  document,
  literal,
  object,
  array,
  reference,
  string,
  union,
  number,
} from "../src/builders"
import {resolve} from "../src/createResolve"
import {Infer} from "../src/defs"

const human = document({
  _type: literal("human"),
  name: object({first: string(), last: string()}),
})


const pet = document({
  _type: literal("pet"),
  name: string(),
  union: union([string(), number()]),
  humans: array(union([reference(human), string()])),
})

const somePet = pet.parse({})

type Pet = Infer<typeof pet>

const someHuman = somePet.humans[0]
