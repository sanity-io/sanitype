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
  literal,
  parse,
  Type,
  ObjectTypeDef,
  OutputType,
  PrimitiveType,
} from "./zanity"

function assertAssignable<A extends B, B>() {}

test("Schema types", () => {
  const str: Type<string, string> = string()

  // todo: make this one fail because they are not compatible
  type Obj = OutputType<{foo: string}, {foo: PrimitiveType<number>}>
})

test("Type assertions", () => {
  const sharedFields = {someField: string()}
  const otherFields = {otherField: string()}

  const str = string()
  const num = number()
  const bool = boolean()
  const stringOrNum = union([string(), number()])
  const arr1 = primitiveArray(string())
  const polyArr = primitiveArray(union([string(), number()]))
  const polyObjectArr = array(
    union([object({foo: string()}), object({age: number()})]),
  )

  const composed = object({...sharedFields, ...otherFields})
  const lit = literal("literal value")

  const myObj = object({
    str,
    num,
    lit,
    stringOrNum,
    polyArr: polyArr,
    polyObjectArr,
    bool,
    arr1,
    composed,
  })

  type MyObj = Infer<typeof myObj>

  assertAssignable<"literal value", MyObj["lit"]>()

  // @ts-expect-error
  assertAssignable<string, MyObj["lit"]>()

  // test inferred type
  assertAssignable<number, MyObj["num"]>()
  assertAssignable<string | number, MyObj["stringOrNum"]>()
  assertAssignable<(string | number)[], MyObj["polyArr"]>()
  assertAssignable<{age: number; _key: string}, MyObj["polyObjectArr"][0]>()
  assertAssignable<{foo: string; _key: string}, MyObj["polyObjectArr"][0]>()
  assertAssignable<string, MyObj["composed"]["someField"]>()
  assertAssignable<string, MyObj["composed"]["otherField"]>()

  // test validation output type
  const res = parse(myObj, {})
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

  const objectOrString = union([object({foo: string()}), string()])

  type T = Infer<typeof objectOrString>

  // @ts-expect-error mixed array (containing both objects and primitives) is not supported
  primitiveArray(union([object({foo: string()}), string()]))

  // @ts-expect-error mixed array (containing both objects and primitives) is not supported
  objectArray(union([object({foo: string()}), string()]))
})

test("Key's in arrays", () => {
  const ii = union([object({foo: string()}), object({bar: string()})])
  type II = Infer<typeof ii>
  const o = objectArray(ii)
  const parsed = parse(o, {})

  const keys = parsed.map(item => item._key)
  assertAssignable<string[], typeof keys>()
})
