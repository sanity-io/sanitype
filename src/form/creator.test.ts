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
import {form} from './creators'

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
  const personForm = form<typeof person>({
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
            location: {title: 'Location'},
            address: {
              title: 'Address',
            },
          },
        },
      },
    },
  })
})
