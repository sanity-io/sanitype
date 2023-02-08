import {lazy, literal, object, string} from "../builders/index.js"
import {OutputOf, SanityType} from "../defs.js"

interface Person {
  _type: "person"
  name: string
  parent: Person
}

const lazyPerson: SanityType<Person> = lazy(() =>
  object({
    _type: literal("person"),
    name: lazy(() => string()),
    parent: lazy(() => lazyPerson),
  }),
)

declare const person: OutputOf<typeof lazyPerson>
