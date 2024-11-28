import {array, block, parse} from '@sanity/sanitype'

const blockSchema = block({})

const portableTextSchema = array(blockSchema)

const myPTArrayValue = parse(portableTextSchema, [])
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
myPTArrayValue[0].style // 'blockSchema'
