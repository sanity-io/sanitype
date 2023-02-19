import {test} from "vitest"
import {Infer} from "../defs.js"
import {document, literal, string} from "../builders/index.js"
import {assertAssignable} from "./helpers.js"

test("optional fields", () => {
  const doc = document({
    _type: literal("pet"),
    optional: string().optional(),
    required: string(),
    otherOptional: string().optional(),
  })

  type Doc = Infer<typeof doc>

  const someDoc: Doc = {} as any

  // this extracts only the optional keys from the type
  type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never
  }[keyof T]

  assertAssignable<"optional", OptionalKeys<Doc>>()
  assertAssignable<"otherOptional", OptionalKeys<Doc>>()

  // @ts-expect-error
  assertAssignable<OptionalKeys<Doc>, "required">()

  assertAssignable<string | undefined, typeof someDoc.optional>()
  // @ts-expect-error
  assertAssignable<string | undefined, typeof someDoc.required>()
})

test("nullable types", () => {
  const doc = document({
    _type: literal("pet"),
    nullable: string().nullable(),
  })

  type Doc = Infer<typeof doc>

  const someDoc: Doc = {} as any

  assertAssignable<string | null, typeof someDoc.nullable>()
  // @ts-expect-error
  assertAssignable<string | undefined, typeof someDoc.nullable>()
})

test("nullish types", () => {
  const doc = document({
    _type: literal("pet"),
    nullish: string().nullish(),
  })

  type Doc = Infer<typeof doc>

  const someDoc: Doc = {} as any

  assertAssignable<string | null, typeof someDoc.nullish>()
  assertAssignable<string | undefined | null, typeof someDoc.nullish>()
})
