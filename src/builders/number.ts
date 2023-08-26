import {Builder} from './builder'
import type {SanityNumber} from '../defs'

export class NumberBuilder extends Builder<number> implements SanityNumber {
  typeName = 'number' as const
}

const NUMBER_BUILDER = new NumberBuilder()
export function number() {
  return NUMBER_BUILDER
}
