import {test} from "vitest"
import {number, object, string} from "../builders/index.js"
import {assertAssignable} from "./helpers.js"

test("extends", () => {
  const o1 = object({a: string(), b: number()})

  const o2 = o1.extend({c: string(), d: number()})

  const f = o2.parse({})

  assertAssignable<{a: string; b: number; c: string; d: number}, typeof f>()
  assertAssignable<{a: "foo"; b: 22; c: "bar"; d: 42}, typeof f>()

  //@ts-expect-error
  assertAssignable<{a: 22; b: "22"; c: 42; d: "42"}, typeof f>()
})
