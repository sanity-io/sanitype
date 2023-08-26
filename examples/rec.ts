// import {literal, object, string} from 'sanitype'
// import type {OutputOf} from 'sanitype'
//
// const lazyPerson = object({
//   _type: literal('person'),
//   name: string(),
//   parent: () => lazyPerson,
// })
//
// const f = object({
//   name: 'xyz',
//   f: () => f,
// })
//
// declare const person: OutputOf<typeof lazyPerson>
