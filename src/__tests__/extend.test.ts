import {test} from 'vitest'
import {number, object, string} from '../creators'
import {extend} from '../extend'
import {parse} from '../parse'
import {assertAssignable} from './helpers'

test('extends', () => {
  const o1 = object({a: string(), b: number()})

  const o2 = extend(o1, {c: string(), d: number()})

  const f = parse(o2, {a: 'a', b: 1, c: 'c', d: 1})

  assertAssignable<{a: string; b: number; c: string; d: number}, typeof f>()
  assertAssignable<{a: 'foo'; b: 22; c: 'bar'; d: 42}, typeof f>()

  //@ts-expect-error not assignable
  assertAssignable<{a: 22; b: '22'; c: 42; d: '42'}, typeof f>()
})
