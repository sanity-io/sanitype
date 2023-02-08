import {Conceal, OutputFromShape, SanityType} from "./defs.js"
import {Combine, OutputFormatFix} from "./utils.js"
import {ReferenceBase, SanityDocumentShape} from "./shapeDefs.js"

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
