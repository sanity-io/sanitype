import {
  Conceal,
  OutputFromShape,
  ReferenceBase,
  SanityDocumentShape,
  SanityType,
} from "./defs.js"
import {Combine, OutputFormatFix} from "./utils.js"

export type SanityArrayValue<ElementType> = Array<
  ElementType extends object
    ? Combine<ElementType, {_key: string}>
    : ElementType
> &
  OutputFormatFix

export type SanityDocumentValue = OutputFromShape<SanityDocumentShape>

export type SanityReferenceValue<RefType> = Combine<
  ReferenceBase,
  Conceal<SanityType<RefType>>
>
