import {type Human} from '../schema/human/current'
import type * as v1 from '../schema/human/v1'

// migrate from a v1 human to a v2 human
export function convert(v1Human: v1.Human): Human {
  const {oldTemporaryField, age, address, ...rest} = v1Human
  return {
    ...rest,
    birthYear: new Date().getFullYear() - v1Human.age,
    addresses: address,
  }
}
