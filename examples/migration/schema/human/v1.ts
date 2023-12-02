import {array, extend, number, omit, string} from 'sanitype'
import * as current from './current'
import type {Infer} from 'sanitype'

export const human = extend(omit(current.human, ['birthYear', 'addresses']), {
  age: number(),
  oldTemporaryField: string(),
  address: array(current.address),
})

export type Human = Infer<typeof human>

export const pet = current.pet
