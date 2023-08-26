import {lazy, literal, object, string} from 'sanitype'
import type {OutputOf, SanityType} from 'sanitype'

interface Person {
  _type: 'person'
  name: string
  parent?: Person
}

const lazyPerson: SanityType<Person> = lazy(() =>
  object({
    _type: literal('person'),
    name: lazy(() => string()),
    parent: lazy(() => lazyPerson).optional(),
  }),
)

declare const person: OutputOf<typeof lazyPerson>
