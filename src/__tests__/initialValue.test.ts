import {expect, test} from "vitest"
import {boolean, document, literal, object, string} from "../builders/index.js"

test("initial value", () => {
  const doc = document({
    _type: literal("pet"),
    good: boolean().initialValue(true),
    kind: string().initialValue("dog"),
    owner: object({name: string(), phoneNumber: string()}).initialValue({
      name: "unknown",
      phoneNumber: "00000",
    }),
  })

  expect(doc.def.good._initialValue).toBe(true)
  expect(doc.def.kind._initialValue).toBe("dog")
  expect(doc.def.owner._initialValue).toEqual({
    name: "unknown",
    phoneNumber: "00000",
  })
})

test("initial value as builder", () => {
  const doc = document({
    _type: literal("pet"),
    good: boolean().initialValue(true).optional(),
    kind: string().initialValue( "dog"),
    owner: object({name: string(), phoneNumber: string()}).initialValue({
      name: "unknown",
      phoneNumber: "00000",
    })
  })

  expect(doc.def.good.def._initialValue).toBe(true)
  expect(doc.def.kind._initialValue).toBe("dog")
})
