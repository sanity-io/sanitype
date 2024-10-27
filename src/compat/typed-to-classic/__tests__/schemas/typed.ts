import {array} from '../../../../creators/array'
import {block} from '../../../../creators/block'
import {boolean} from '../../../../creators/boolean'
import {dateTime} from '../../../../creators/dateTime'
import {document} from '../../../../creators/document'
import {file} from '../../../../creators/file'
import {image} from '../../../../creators/image'
import {literal} from '../../../../creators/literal'
import {number} from '../../../../creators/number'
import {object} from '../../../../creators/object'
import {string} from '../../../../creators/string'
import {union} from '../../../../creators/union'
import {extend} from '../../../../utils/extend'

const pet = object({name: string()})
export const human = document({
  _type: literal('human'),
  name: string(),
  birthTime: dateTime(),
  favoriteTimes: array(dateTime()),
  address: object({
    street: string(),
    city: string(),
    country: string(),
  }),
  profilePicture: image({
    alt: string(),
  }),
  cv: file({
    description: string(),
  }),
  portableText: array(
    union([
      block({
        _type: literal('myCustomBlock'),
        style: union([literal('normal'), literal('h1'), literal('h2')]),
        list: union([literal('bullet'), literal('number')]),
        inline: union([
          object({
            _type: literal('author'),
            name: string(),
          }),
        ]),
        decorator: union([literal('strong'), literal('em')]),
        annotation: union([
          object({_type: literal('author'), foo: number()}),
          object({_type: literal('book'), bar: number()}),
        ]),
      }),
      image({}),
    ]),
  ),
  pets: array(
    union([
      extend(pet, {
        _type: literal('avine'),
        squeaks: boolean(),
      }),
      extend(pet, {
        _type: literal('feline'),
        meows: boolean(),
      }),
      extend(pet, {
        _type: literal('canine'),
        barks: boolean(),
      }),
    ]),
  ),
})
