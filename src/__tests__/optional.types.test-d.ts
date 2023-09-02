import {assertType, test} from 'vitest'
import type {
  Infer,
  SanityDocument,
  SanityLiteral,
  SanityOptional,
  SanityString,
} from '../defs'

test('optional fields', () => {
  type DocType = SanityDocument<{
    _type: SanityLiteral<'pet'>
    optional: SanityOptional<SanityString>
    required: SanityString
    otherOptional: SanityOptional<SanityString>
  }>

  type Doc = Infer<DocType>
  const someDoc = {} as Doc

  // this extracts only the optional keys from the type
  type OptionalKeys<T> = {
    [K in keyof T]-?: object extends {[P in K]: T[K]} ? K : never
  }[keyof T]

  assertType<OptionalKeys<Doc>>('optional')
  assertType<OptionalKeys<Doc>>('otherOptional')

  // @ts-expect-error - 'required' should not be among optional keys
  assertType<OptionalKeys<Doc>>('required')

  assertType<string | undefined>(someDoc.optional)

  // @ts-expect-error undefined not assignable to someDoc.require
  assertType<undefined>(someDoc.required)
})
