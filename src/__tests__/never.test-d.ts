import {describe, expectTypeOf, test} from 'vitest'

import {array, literal, object, string, union} from '../creators'
import {never} from '../creators/never'
import {type Infer} from '../defs'

describe('never type', () => {
  test('never type inference', () => {
    const neverType = never()
    type NeverOutput = Infer<typeof neverType>
    expectTypeOf<NeverOutput>({} as never)
  })

  test('never type inference as member of other types', () => {
    const someObject = object({
      cantTouchThis: never(),
      primitiveUnion: union([string(), literal('foo'), never()]),
      objectUnion: union([
        object({_type: literal('foo'), foo: string()}),
        never(),
      ]),
      neverArray: array(never()),
      name: string(),
    })

    type SomeObjectType = Infer<typeof someObject>

    expectTypeOf<SomeObjectType>(
      {} as {
        cantTouchThis: never
        primitiveUnion: 'foo'
        objectUnion: {_type: 'foo'; foo: string}
        neverArray: never[]
        name: string
      },
    )
  })
})
