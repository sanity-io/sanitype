import {defineType as dt} from './utils/defineType'
import type {
  Conceal,
  Infer,
  OutputFromShape,
  SanityBoolean,
  SanityLiteral,
  SanityObject,
  SanityOptional,
  SanityString,
  SanityType,
  UndefinedOptional,
} from './defs'
import type {Combine, OutputFormatFix} from './utils/utilTypes'

const STRING: SanityString = dt({typeName: 'string', def: ''})
const OPTIONAL_STRING: SanityOptional<SanityString> = dt({
  typeName: 'optional',
  type: STRING,
})
const BOOLEAN: SanityBoolean = dt({
  typeName: 'boolean',
  def: true,
})

export type SanityDocumentShape = {
  _type: SanityString | SanityLiteral<string>
  _id: SanityOptional<SanityString>
  _createdAt: SanityOptional<SanityString>
  _updatedAt: SanityOptional<SanityString>
  _rev: SanityOptional<SanityString>
}

export const documentBase: SanityObject<SanityDocumentShape> = dt({
  typeName: 'object',
  shape: {
    _type: STRING,
    _id: OPTIONAL_STRING,
    _createdAt: OPTIONAL_STRING,
    _updatedAt: OPTIONAL_STRING,
    _rev: OPTIONAL_STRING,
  },
})

export type SanityReferenceShape = {
  _type: SanityString | SanityLiteral<'reference'>
  _ref: SanityString
  _weak: SanityOptional<SanityBoolean>
}

const REFERENCE_LITERAL: SanityLiteral<'reference'> = dt({
  typeName: 'literal',
  value: 'reference',
})

export const referenceBase: SanityObject<SanityReferenceShape> = dt({
  typeName: 'object',
  shape: {
    _type: REFERENCE_LITERAL,
    _ref: STRING,
    _weak: dt({typeName: 'optional' as const, type: BOOLEAN}),
  },
})

export type ReferenceBase = Infer<typeof referenceBase>

export type SanityArrayValue<ElementType> = Array<
  ElementType extends object
    ? Combine<ElementType, {_key: string}>
    : ElementType
> &
  OutputFormatFix

export type SanityDocumentValue = UndefinedOptional<
  OutputFromShape<SanityDocumentShape>
>

export type SanityReferenceValue<RefType> = Combine<
  ReferenceBase,
  Conceal<SanityType<RefType>>
>
