import {Builder} from './builder'
import type {SanityBoolean} from '../defs'

export class BooleanBuilder extends Builder<boolean> implements SanityBoolean {
  typeName = 'boolean' as const
}

const BOOLEAN_BUILDER = new BooleanBuilder()

export function boolean() {
  return BOOLEAN_BUILDER
}
