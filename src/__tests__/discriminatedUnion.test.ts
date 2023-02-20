import {test, describe, expect} from "vitest"
import {literal, number, object, string} from "../builders/index.js"
import {discriminatedUnion} from "../builders/discriminatedUnion.js"
import {
  SanityDiscriminatedUnion,
  SanityLiteral,
  SanityObject,
  SanityString,
} from "../defs.js"

describe("discriminated union", () => {
  test("successful parsing", () => {
    const union = discriminatedUnion("status", [
      object({status: literal("success"), data: string()}),
      object({status: literal("failed"), error: string()}),
    ])

    union.parse({status: "success", data: "it succeeded"})
  })
  test("failed parsing when invalid literal value for discriminator", () => {
    const union = discriminatedUnion("status", [
      object({status: literal("success"), data: string()}),
      object({status: literal("failed"), error: string()}),
    ])

    expect(union.safeParse({status: "neither"})).toMatchInlineSnapshot(`
      {
        "errors": [
          {
            "code": "INVALID_DISCRIMINATED_UNION",
            "message": "Input is not valid as the discriminated union type status=\\"neither\\"",
            "path": [],
          },
        ],
        "status": "fail",
      }
    `)
  })
  test("failed parsing when schema doesn't match discriminated union type", () => {
    const union = discriminatedUnion("status", [
      object({status: literal("success"), data: object({num: number()})}),
      object({status: literal("failed"), error: string()}),
    ])

    expect(union.safeParse({status: "success", data: {num: "should be number"}}))
      .toMatchInlineSnapshot(`
        {
          "errors": [
            {
              "code": "INVALID_DISCRIMINATED_UNION",
              "message": "Input is not valid as the discriminated union type status=\\"success\\"",
              "path": [],
            },
            {
              "code": "INVALID_TYPE",
              "message": "Expected a number but got \\"'should be number'\\"",
              "path": [
                "data",
                "num",
              ],
            },
          ],
          "status": "fail",
        }
      `)
  })
})

test("discriminated union typings", () => {
  type Ok = SanityDiscriminatedUnion<
    | SanityObject<{type: SanityLiteral<"success">; successProp: SanityString}>
    | SanityObject<{type: SanityLiteral<"failure">; failureProp: SanityString}>,
    "type"
  >

  type Err1 = SanityDiscriminatedUnion<
    | SanityObject<{type: SanityString; successProp: SanityString}>
    | SanityObject<{type: SanityLiteral<"failure">; failureProp: SanityString}>,
    //@ts-expect-error Discriminator must be a literal value
    "type"
  >

  type Err2 = SanityDiscriminatedUnion<
    | SanityObject<{type: SanityLiteral<"success">; successProp: SanityString}>
    | SanityObject<{type: SanityLiteral<"failure">; failureProp: SanityString}>,
    //@ts-expect-error Discriminator must be a literal value
    "nonexistent"
  >
})
