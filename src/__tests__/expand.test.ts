import {test} from "vitest"
import {document, reference, string} from "../factories.js"
import {parse} from "../parse.js"
import {expand} from "../expand.js"
import {assertAssignable} from "./helpers.js"

const country = document("country", {
  name: string(),
})

const personType = document("person", {
  firstName: string(),
  lastName: string(),
  country: reference(country),
})

test("reference expansion", async () => {
  const person = parse(personType, {})
  const personCountry = await expand(person.country)

  assertAssignable<typeof personCountry._type, "country">()
  // @ts-expect-error
  assertAssignable<typeof personCountry._type, "not-this">()

  const anonRef = await expand({_ref: "xyz", _type: "reference"})
  // best we can do is string, since we have no type info available
  assertAssignable<typeof anonRef._type, string>()

  // @ts-expect-error note: we assert that first parameter extends second and string isn't a subtype of "country"
  assertAssignable<typeof anonRef._type, "country">()
})
