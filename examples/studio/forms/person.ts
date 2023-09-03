import {form} from 'sanitype'
import type {person} from '../schema/person'

export const personForm = form<typeof person>({
  fields: {
    name: {
      title: 'Name',
      form: {},
    },
    address: {
      title: 'Address',
      form: {
        fields: {
          street: {
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
