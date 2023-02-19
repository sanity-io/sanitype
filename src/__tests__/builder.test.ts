import {expect, test} from "vitest"
import {boolean, document, literal, string} from "../builders/index.js"

function expectFunction(value: any): asserts value is CallableFunction {
  expect(value).toBeTypeOf("function")
}

test("builder", async () => {
  const doc = document({
    _type: literal("pet"),
    good: boolean().initialValue(true),
    kind: string()
      .initialValue("dog")
      .optional()
      .initialValue(() => Promise.resolve("cat")),
  })

  expectFunction(doc.def.kind._initialValue)
  expect(await doc.def.kind._initialValue()).toBe("cat")
  // const parse = doc.parse("")
})
