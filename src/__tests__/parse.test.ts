import {describe, expect, test} from "vitest"
import {safeParse} from "../parse.js"

import {lazy, object, string} from "../factories.js"
import {SanityType} from "../defs.js"

describe("string parsing", () => {
  test("successful parsing", () => {
    const schema = string()
    const parsed = safeParse(schema, "foo")
    expect(parsed).toMatchObject({
      status: "ok",
      value: "foo",
    })
  })
  test("failed parsing", () => {
    const schema = string()
    const parsed = safeParse(schema, undefined)
    expect(parsed).toMatchObject({
      status: "fail",
      errors: [{path: [], code: "INVALID_TYPE", message: /.+/}],
    })
  })
})

describe("object parsing", () => {
  test("parsing of simple object", () => {
    const schema = object({foo: string()})
    const parsed = safeParse(schema, {foo: "bar"})
    expect(parsed).toMatchObject({
      status: "ok",
      value: {foo: "bar"},
    })
  })
  test("parsing of complex object", () => {
    const schema = object({
      title: string(),
      nested: object({something: string()}),
    })
    const parsed = safeParse(schema, {
      title: "hello",
      nested: {something: "world"},
    })
    expect(parsed).toMatchObject({
      status: "ok",
      value: {title: "hello", nested: {something: "world"}},
    })
  })
  test("failed parsing", () => {
    const schema = object({
      title: string(),
      nested: object({something: string()}),
    })
    const parsed = safeParse(schema, {title: "hello", nested: {something: 1}})

    expect(parsed).toMatchObject({
      status: "fail",
      errors: [
        {path: ["nested", "something"], code: "INVALID_TYPE", message: /.+/},
      ],
    })
  })
  test("circular/lazy", () => {
    type Person = {
      name: string
      parent: Person
    }
    const person: SanityType<Person> = lazy(() =>
      object({
        name: string(),
        parent: person,
      }),
    )

    const parsed = safeParse(person, {
      name: "Tester",
      parent: {name: "Tester's parent"},
    })

    expect(parsed).toEqual({
      status: "ok",
      value: {name: "Tester", parent: {name: "Tester's parent"}},
    })
  })
})
