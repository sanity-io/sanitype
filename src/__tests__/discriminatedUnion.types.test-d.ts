import {test} from 'vitest'
import type {
  SanityDiscriminatedUnion,
  SanityLiteral,
  SanityObject,
  SanityString,
} from '../defs'

// lil helper to avoid having to alias types everywhere
declare function pass<T>(): any

test('discriminated union typings', () => {
  pass<
    SanityDiscriminatedUnion<
      | SanityObject<{
          type: SanityLiteral<'success'>
          successProp: SanityString
        }>
      | SanityObject<{
          type: SanityLiteral<'failure'>
          failureProp: SanityString
        }>,
      'type'
    >
  >()

  pass<
    SanityDiscriminatedUnion<
      | SanityObject<{type: SanityString; successProp: SanityString}>
      | SanityObject<{
          type: SanityLiteral<'failure'>
          failureProp: SanityString
        }>,
      //@ts-expect-error Discriminator must be a literal value
      'type'
    >
  >()

  pass<
    SanityDiscriminatedUnion<
      | SanityObject<{
          type: SanityLiteral<'success'>
          successProp: SanityString
        }>
      | SanityObject<{
          type: SanityLiteral<'failure'>
          failureProp: SanityString
        }>,
      //@ts-expect-error Discriminator must be a literal value
      'nonexistent'
    >
  >()
})
