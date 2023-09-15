import {defineForm} from 'sanitype'
import type {person} from '../schema/person'

/**
 * Define a form for the person type. TypeScript will yell at you if you don't declare a field for all properties defined
 * for the schema type
 */
export const personForm = defineForm<typeof person>({
  fields: {
    name: {
      title: 'Name',
      form: {}, // Note: will make this optional (kept required and explicit for now)
    },
    address: {
      title: 'Address',
      form: {
        fields: {
          street: {
            readonly: true,
            title: 'Street',
            form: {},
          },
          city: {
            title: 'City',
            form: {},
          },
          country: {
            title: 'Country',
            form: {},
          },
        },
      },
    },
  },
})
