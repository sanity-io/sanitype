import {
  _object,
  literal,
  string,
  optional,
  boolean,
} from "./__deprecated_factories.js"
import {Infer, SanityLiteral, SanityString} from "./defs.js";

export const documentBase = _object({
  _type: string(),
  _id: string(),
  _createdAt: string(),
  _updatedAt: string(),
  _rev: string(),
})

export const referenceBase = _object({
  _type: literal("reference"),
  _ref: string(),
  _weak: optional(boolean()),
})
export type ReferenceBase = Infer<typeof referenceBase>

export type SanityDocumentShape = {
  _type: SanityLiteral<string>
  _id: SanityString
  _createdAt: SanityString
  _updatedAt: SanityString
  _rev: SanityString
}
