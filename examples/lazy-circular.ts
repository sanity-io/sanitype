import {extend, lazy, literal, number, object, string} from 'sanitype'
import type {OutputOf, SanityObjectType} from 'sanitype'

interface Person {
  _type: 'person'
  name: number
  parent: Person & {foo: string}
}

const lazyPerson: SanityObjectType<Person> = object({
  _type: literal('person'),
  name: lazy(() => number()),
  foo: literal('ok'),
  parent: lazy(() => extend(lazyPerson, {foo: string()})),
})

declare const person: OutputOf<typeof lazyPerson>
