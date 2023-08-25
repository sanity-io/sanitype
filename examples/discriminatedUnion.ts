import {discriminatedUnion, literal, object, string,} from "sanitype"

const myUnion = discriminatedUnion("status", [
  object({status: literal("success"), successProp: string()}),
  object({status: literal("failed"), failureProp: string()}),
])

const f = myUnion.parse({status: "success", successProp: "it worked"})
