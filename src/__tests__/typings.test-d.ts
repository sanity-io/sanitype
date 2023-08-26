import {test} from 'vitest'

import {
  array,
  boolean,
  document,
  literal,
  number,
  object,
  objectArray,
  primitiveArray,
  reference,
  string,
  union,
} from '../builders'
import {parse, safeParse} from '../parse'
import {assertAssignable} from './helpers'
import type {Infer} from '../defs'

test('Schema types', () => {
  //@ts-expect-error type definition says foo should be a number, but output type requires it to be a string
  type Obj = ObjectTypeDef<{foo: NumberTypeDef}, {foo: string}>
})

test('Type assertions', () => {
  const sharedFields = {someField: string()}
  const otherFields = {otherField: string()}

  const str = string()
  const num = number()
  const bool = boolean()
  const stringOrNum = union([string(), number()])
  const arr1 = primitiveArray(string())
  const polyArr = primitiveArray(union([string(), number()]))
  const polyObjectArr = array(
    union([
      object({_type: literal('foo'), foo: string()}),
      object({_type: literal('two'), age: number()}),
    ]),
  )

  const composed = object({...sharedFields, ...otherFields})
  const lit = literal('literal value')

  const myObj = object({
    str,
    num,
    lit,
    stringOrNum,
    polyArr,
    polyObjectArr,
    bool,
    arr1,
    composed,
  })

  type MyObj = Infer<typeof myObj>

  assertAssignable<'literal value', MyObj['lit']>()

  // @ts-expect-error
  assertAssignable<string, MyObj['lit']>()

  // test inferred type
  assertAssignable<number, MyObj['num']>()
  assertAssignable<string | number, MyObj['stringOrNum']>()
  assertAssignable<(string | number)[], MyObj['polyArr']>()

  assertAssignable<
    //@ts-expect-error this isn't a valid value for "foo" type
    {_type: 'foo'; age: number; _key: string},
    MyObj['polyObjectArr'][0]
  >()
  assertAssignable<
    {_type: 'foo'; foo: string; _key: string},
    MyObj['polyObjectArr'][0]
  >()
  assertAssignable<string, MyObj['composed']['someField']>()
  assertAssignable<string, MyObj['composed']['otherField']>()

  // test validation output type
  const res = parse(myObj, {
    str: 'string',
    num: 2,
    lit: 'literal value',
    stringOrNum: 'str',
    polyArr: [],
    polyObjectArr: [],
    bool: true,
    arr1: [],
    composed: {someField: 'foo', otherField: 'bar'},
  })
  assertAssignable<string, typeof res.str>()
  assertAssignable<number, typeof res.num>()
  assertAssignable<boolean, typeof res.bool>()

  assertAssignable<
    {_type: 'foo'; foo: string; _key: string}[],
    typeof res.polyObjectArr
  >()

  assertAssignable<number, typeof res.stringOrNum>()
  assertAssignable<string, typeof res.stringOrNum>()

  assertAssignable<string[], typeof res.polyArr>()
  assertAssignable<number[], typeof res.polyArr>()
})

test('Restrictions', () => {
  // @ts-expect-error array of array is not allowed
  array(array(number()))

  // @ts-expect-error array of array is not allowed
  array(array(object({foo: string()})))

  // @ts-expect-error objectArray of a primitive value is not allowed
  objectArray(string())

  const objectOrString = union([object({foo: string()}), string()])

  type T = Infer<typeof objectOrString>

  // @ts-expect-error mixed array (containing both objects and primitives) is not supported
  primitiveArray(union([object({foo: string()}), string()]))

  // @ts-expect-error mixed array (containing both objects and primitives) is not supported
  objectArray(union([object({foo: string()}), string()]))
})

test("Key's in arrays", () => {
  const items = union([object({foo: string()}), object({bar: string()})])
  const o = objectArray(items)
  const parsed = safeParse(o, {})

  if (parsed.status === 'ok') {
    const keys = parsed.value.map(item => item._key)
    assertAssignable<string[], typeof keys>()
  }
})
test("Key's in arrays of references", () => {
  const pet = document({_type: literal('pet'), name: string()})
  const o = objectArray(reference(pet))
  const parsed = parse(o, [{_type: 'reference', _key: 'someKey', _ref: 'jara'}])
  const keys = parsed.map(item => item._key)
  assertAssignable<string[], typeof keys>()
})
