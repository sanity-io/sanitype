import {
  array,
  literal,
  number,
  object,
  parse,
  string,
  union,
  type Infer,
} from '@sanity/sanitype'
import {block} from '../../src/creators/block'

const someBlock = block({
  _type: literal('someBlock'),
  styles: [literal('normal'), literal('h1'), literal('h2')],
  lists: [literal('bullet'), literal('number')],
  inlineTypes: [
    object({
      _type: literal('author'),
      name: string(),
    }),
  ],
  decorators: [literal('strong'), literal('em')],
  annotations: [
    object({_type: literal('author'), foo: number()}),
    object({_type: literal('book'), bar: number()}),
  ],
})

const myPTArray = array(someBlock)

type MyPTArray = Infer<typeof myPTArray>

const myPTArrayValue = parse(myPTArray, [])
myPTArrayValue[0]._type // 'someBlock'
