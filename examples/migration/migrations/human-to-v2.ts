import type * as v1 from '../schema/human/v1'
import type * as v2 from '../schema/human/v2'

// migrate from a v1 human to a v2 human
export function convert(v1Person: v1.Human): v2.Human {
  const {oldTemporaryField, age, address, ...rest} = v1Person
  return {
    ...rest,
    birthYear: new Date().getFullYear() - v1Person.age,
    addresses: address,
  }
}
