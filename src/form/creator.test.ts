import {test} from 'vitest'
import {
  array,
  document,
  lazy,
  literal,
  number,
  object,
  string,
  union,
} from '../creators'
import {defineForm} from './creators'

const person = document({
  _type: literal('person'),
  firstName: string(),
  lastName: string(),
  addresses: array(
    union([
      object({
        _type: literal('address'),
        street: string(),
        city: string(),
        country: string(),
      }),
      object({
        _type: literal('location'),
        street: string(),
        city: string(),
        country: string(),
      }),
    ]),
  ),
})

test('define a basic nested form', () => {
  const personForm = defineForm<typeof person>({
    fields: {
      firstName: {
        title: 'Name',
        readonly: true,
      },
      lastName: {
        title: 'Tag',
        readonly: true,
      },
      addresses: {
        title: 'test',
        readonly: true,
        form: {
          draggable: true,
          items: {
            location: {
              title: 'Location',
              form: {
                fields: {
                  city: {title: 'City'},
                  country: {title: 'Country'},
                  street: {title: 'Street'},
                },
              },
            },
            address: {
              title: 'Address',
              form: {
                fields: {
                  city: {title: 'City'},
                  country: {title: 'Country'},
                  street: {title: 'Street'},
                },
              },
            },
          },
        },
      },
    },
  })
})
