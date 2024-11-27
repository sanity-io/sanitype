import * as s from '@sanity/sanitype'

const someBlock = s.block({
  _type: s.literal('someBlock'),
  style: s.union([s.literal('normal'), s.literal('h1'), s.literal('h2')]),
  list: s.union([s.literal('bullet'), s.literal('number')]),
  inline: s.union([
    s.object({
      _type: s.literal('author'),
      name: s.string(),
    }),
  ]),
  decorator: s.union([s.literal('strong'), s.literal('em')]),
  annotation: s.union([
    s.object({_type: s.literal('author'), foo: s.number()}),
    s.object({_type: s.literal('book'), bar: s.number()}),
  ]),
})

const myPTArray = s.array(someBlock)

type MyPTArray = s.Infer<typeof myPTArray>

const myPTArrayValue = parse(myPTArray, [])

myPTArrayValue.map(
  element => element._type, // 'someBlock'
)
const myPTArrayValue = s.parse(myPTArray, [])
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
myPTArrayValue[0]._type // 'someBlock'
