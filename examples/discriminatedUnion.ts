import {literal, object, string,} from "../src/builders"
import {discriminatedUnion} from "../src/builders/discriminatedUnion"

const myUnion = discriminatedUnion("status", [
  object({status: literal("success"), successProp: string()}),
  object({status: literal("failed"), failureProp: string()}),
])

const f = myUnion.parse({status: "success", successProp: "it worked"})
