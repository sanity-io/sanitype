import {extend, number, omit} from 'sanitype'
import {human as v1} from './v1'
import type {Infer} from 'sanitype'

// a v2 human builds upon v1 but:
// - omits the oldTemporaryField
// - adds a new field: birth year
// - renames address to addresses

// Note: there are several ways this could be done

export const human = extend(omit(v1, ['oldTemporaryField', 'age', 'address']), {
  birthYear: number(),
  addresses: v1.shape.address,
})

export type Human = Infer<typeof human>
