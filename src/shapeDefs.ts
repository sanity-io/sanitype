import {
  Conceal,
  Infer,
  OutputFromShape,
  SanityBoolean,
  SanityLiteral,
  SanityObject,
  SanityOptional,
  SanityString,
  SanityType,
} from "./defs.js"
import {Combine, defineNonEnumerableGetter, OutputFormatFix} from "./utils.js"

const STRING: SanityString = dt({typeName: "string", def: ""})
const BOOLEAN: SanityBoolean = dt({
  typeName: "boolean",
  def: true,
})

export type SanityDocumentShape = {
  _type: SanityString | SanityLiteral<string>
  _id: SanityString
  _createdAt: SanityString
  _updatedAt: SanityString
  _rev: SanityString
}

export const documentBase: SanityObject<SanityDocumentShape> = dt({
  typeName: "object",
  def: {
    _type: STRING,
    _id: STRING,
    _createdAt: STRING,
    _updatedAt: STRING,
    _rev: STRING,
  },
})

export type SanityReferenceShape = {
  _type: SanityString | SanityLiteral<"reference">
  _ref: SanityString
  _weak: SanityOptional<SanityBoolean>
}

const REFERENCE_LITERAL: SanityLiteral<"reference"> = dt({
  typeName: "literal",
  def: "reference",
})

export const referenceBase: SanityObject<SanityReferenceShape> = dt({
  typeName: "object",
  def: {
    _type: REFERENCE_LITERAL,
    _ref: STRING,
    _weak: dt({typeName: "optional" as const, def: BOOLEAN}),
  },
})

export type ReferenceBase = Infer<typeof referenceBase>

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

/**
 * defineType
 * @param target
 */
function dt<T>(target: T): T & {output: never} {
  return defineNonEnumerableGetter(target, "output", () => {
    throw new Error("This method is not defined runtime")
  }) as T & {output: never}
}
