import {test} from "vitest"
import {
  primitiveArray,
  objectArray,
  boolean,
  Infer,
  number,
  object,
  string,
  union,
  array,
} from "./zanity"

function assertAssignable<A extends B, B>() {}

test("Type assertions", () => {
  const sharedFields = {someField: string()}
  const otherFields = {otherField: string()}

  const str = string()
  const num = number()
  const bool = boolean()
  const stringOrNum = union([string(), number()])
  const arr1 = primitiveArray(string())
  const polyArr = primitiveArray(union([string(), number()]))
  const composed = object({...sharedFields, ...otherFields})

  const myObj = object({
    str,
    num,
    stringOrNum,
    polyArr: polyArr,
    bool,
    arr1,
    composed,
  })

  type MyObj = Infer<typeof myObj>

  // test inferred type
  assertAssignable<number, MyObj["num"]>()
  assertAssignable<string | number, MyObj["stringOrNum"]>()
  assertAssignable<(string | number)[], MyObj["polyArr"]>()
  assertAssignable<string, MyObj["composed"]["someField"]>()
  assertAssignable<string, MyObj["composed"]["otherField"]>()

  // test validation output type
  const res = myObj.parse({})
  assertAssignable<string, typeof res.str>()
  assertAssignable<number, typeof res.num>()
  assertAssignable<boolean, typeof res.bool>()

  assertAssignable<number, typeof res.stringOrNum>()
  assertAssignable<string, typeof res.stringOrNum>()

  assertAssignable<string[], typeof res.polyArr>()
  assertAssignable<number[], typeof res.polyArr>()
})

test("Restrictions", () => {
  // @ts-expect-error array of array is not allowed
  array(array(number()))

  // @ts-expect-error array of array is not allowed
  array(array(object({foo: string()})))

  // @ts-expect-error objectArray of a primitive value is not allowed
  objectArray(string())

  // @ts-expect-error mixed array (containing both objects and primitives) is not supported
  primitiveArray(union([object({foo: string()}), string()]))

  // @ts-expect-error mixed array (containing both objects and primitives) is not supported
  objectArray(union([object({foo: string()}), string()]))
})
