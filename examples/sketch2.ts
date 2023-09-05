import {document, literal, object, string} from 'sanitype'
import {form} from 'sanitype'

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

const petForm = form<typeof pet>({
  fields: {
    name: {
      title: 'Name',
      readonly: true,
      form: {},
    },
    tag: {
      title: 'Tag',
      readonly: true,
      form: tagForm,
    },
  },
})
