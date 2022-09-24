import {array, Infer, number, object, string, union} from "./minizod"

function assertAssignable<A extends B, B>() {}

const sharedFields = {someField: string()}
const otherFields = {otherField: string()}

const str = string()
const num = number()
const stringOrNum = union([string(), number()])
const arr = array(union([string(), number()]))
const arr1 = array(string())
const composed = object({...sharedFields, ...otherFields})

const myObj = object({
  str,
  num,
  stringOrNum,
  arr,
  arr1,
  composed,
})

type MyObj = Infer<typeof myObj>

// test inferred type
assertAssignable<number, MyObj["num"]>()
assertAssignable<string | number, MyObj["stringOrNum"]>()
assertAssignable<(string | number)[], MyObj["arr"]>()
assertAssignable<string, MyObj["composed"]["someField"]>()
assertAssignable<string, MyObj["composed"]["otherField"]>()

// test validation output type
const res = myObj.parse({})
assertAssignable<string, typeof res.str>()
assertAssignable<number, typeof res.num>()

assertAssignable<number, typeof res.stringOrNum>()
assertAssignable<string, typeof res.stringOrNum>()

assertAssignable<string[], typeof res.arr>()
assertAssignable<number[], typeof res.arr>()
