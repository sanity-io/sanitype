import {reference} from './creators'
import {defineType as dt} from './helpers/defineType'
import {imageAsset} from './schema/assets'
import type {
  Conceal,
  Infer,
  OutputFromShape,
  SanityBoolean,
  SanityLiteral,
  SanityObject,
  SanityObjectShape,
  SanityOptional,
  SanityReference,
  SanityString,
  SanityType,
  UndefinedOptional,
} from './defs'
import type {Combine, OutputFormatFix} from './helpers/utilTypes'

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

export type SanityImageShape = SanityObjectShape & {
  _type: SanityLiteral<'image'>
  asset: SanityReference<typeof imageAsset>
}

const IMAGE_LITERAL: SanityLiteral<'image'> = dt({
  typeName: 'literal',
  value: 'image',
})

export const imageBase: SanityObject<SanityImageShape> = dt({
  typeName: 'object',
  shape: {
    _type: IMAGE_LITERAL,
    asset: reference(imageAsset),
  },
})

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
