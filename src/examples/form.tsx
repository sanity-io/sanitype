import {
  array,
  document,
  literal,
  object,
  reference,
  string,
} from "../factories.js"
import {Infer, SanityObject, SanityType} from "../defs.js"
import React, {useState} from "react"

const pet = document({_type: literal("pet"), name: string()})

const person = document({
  _type: literal("person"),
  firstName: string(),
  lastName: string(),
  favoritePet: reference(pet),
  pets: array(reference(pet)),
  dwelling: object({street: string(), city: string(), country: string()}),
})

declare function objectForm<T extends SanityObject = SanityObject>(
  type: T,
  args: any,
): void
declare function stringForm<T extends SanityType = SanityType>(
  type: T,
  args: any,
): void

// legacy schema-like
const PetSelect = () => <input type="text" />
const DwellingMap = () => <input type="text" />

const legacyPersonSchema = {
  type: person,
  fields: {
    firstName: {title: "First name"},
    lastName: {title: "Last name"},
    favoritePet: {title: "Favorite pet", component: PetSelect},
    dwelling: {
      title: "Dwelling",
      fields: {
        street: {title: "Street"},
        city: {title: "City"},
        country: {title: "Country"},
      },
      input: DwellingMap,
    },
  },
}

// const MyForm = objectForm(person, {
//   firstName: stringForm({title: "First name", component: FirstNameComponent}),
//   lastName: stringForm({title: "Last name", component: FirstNameComponent}),
// })

function App() {
  const [value, setValue] = useState<Infer<typeof person>>()

  return <form>{/*<MyForm value={value} onChange={setValue} />*/}</form>
}
