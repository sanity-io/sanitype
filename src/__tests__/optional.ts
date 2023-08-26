import {test} from 'vitest'
import {document, literal, string} from '../builders'
import {assertAssignable} from './helpers'
import type {Infer} from '../defs'

test('optional fields', () => {
  const doc = document({
    _type: literal('pet'),
    optional: string().optional(),
    required: string(),
    otherOptional: string().optional(),
  })

  type Doc = Infer<typeof doc>

  const someDoc: Doc = {} as any

  // this extracts only the optional keys from the type
  type OptionalKeys<T> = {
    [K in keyof T]-?: object extends {[P in K]: T[K]} ? K : never
  }[keyof T]

  assertAssignable<'optional', OptionalKeys<Doc>>()
  assertAssignable<'otherOptional', OptionalKeys<Doc>>()

  // @ts-expect-error - 'required' should not be among optional keys
  assertAssignable<OptionalKeys<Doc>, 'required'>()

  assertAssignable<string | undefined, typeof someDoc.optional>()
  // @ts-expect-error undefined not assignable to someDoc.require
  assertAssignable<string | undefined, typeof someDoc.required>()
})
