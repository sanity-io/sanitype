import {expect, test, vi} from "vitest"
import {document, literal, reference, string} from "../builders/index.js"
import {parse} from "../parse.js"
import {createResolve} from "../createResolve.js"
import {assertAssignable} from "./helpers.js"

const country = document({
  _type: literal("country"),
  name: string(),
})

const personType = document({
  _type: literal("person"),
  firstName: string(),
  lastName: string(),
  country: reference(country),
})

test("resolve reference with schema", async () => {
  const person = parse(personType, {
    _id: "carl",
    _type: "person",
    firstName: "Carl",
    lastName: "Sagan",
    country: {_type: "reference", _ref: "usa"},
  })

  const fetch = vi.fn().mockResolvedValueOnce({
    _type: "country",
    _id: "usa",
    name: "USA",
  })
  const resolve = createResolve(fetch)

  const personCountry = await resolve(person.country)
  expect(fetch.mock.calls).toEqual([["usa"]])

  assertAssignable<typeof personCountry._type, "country">()
  // @ts-expect-error
  assertAssignable<typeof personCountry._type, "not-this">()
})
test("resolve schemaless reference", async () => {
  const fetch = vi.fn().mockResolvedValueOnce({
    _type: "country",
    _id: "usa",
    _createdAt: "2021-01-01 00:00:00",
    _updatedAt: "2021-01-01 00:00:00",
    _rev: "xyz",
  })
  const resolve = createResolve(fetch)

  const anonRef = await resolve({_ref: "xyz", _type: "reference", _weak: false})
  // best we can do is string, since we have no type info available
  assertAssignable<typeof anonRef._type, string>()

  // @ts-expect-error note: we assert that first parameter extends second and string isn't a subtype of "country"
  assertAssignable<typeof anonRef._type, "country">()
})
