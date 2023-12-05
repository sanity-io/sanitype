import {array, document, literal, object, union} from 'sanitype'
import {strictMode} from '../../src/helpers/strictMode'

const personSchema = strictMode(
  object({
    _type: literal('person'),
    name: object({
      _type: literal('name'),
      first: 'string',
      last: 'string',
    }),
    arr: array(
      union([
        object({
          _type: literal('a'),
        }),
        object({
          _type: literal('b'),
        }),
      ]),
    ),
  }),
)
