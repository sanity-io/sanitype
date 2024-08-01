import {defineForm, document, literal, object, string} from '@sanity/sanitype'

const pet = document({
  _type: literal('pet'),
  name: string(),
  tag: object({
    provider: string(),
    id: string(),
  }),
})

const defaultStringForm = {title: 'String'}

const tagForm = {
  fields: {
    provider: {
      title: 'Provider',
      readonly: true,
      form: defaultStringForm,
    },
    id: {
      title: 'Provider',
      readonly: true,
      form: defaultStringForm,
    },
  },
}

const petForm = defineForm(pet, {
  fields: {
    name: {
      title: 'Name',
      readonly: true,
    },
    tag: {
      ...tagForm,
      title: 'Tag',
      readonly: true,
    },
  },
})
