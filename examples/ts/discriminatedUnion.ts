import {discriminatedUnion, literal, object, parse, string} from 'sanitype'

const myUnion = discriminatedUnion('status', [
  object({status: literal('success'), successProp: string()}),
  object({status: literal('failed'), failureProp: string()}),
])

const f = parse(myUnion, {status: 'success', successProp: 'it worked'})
