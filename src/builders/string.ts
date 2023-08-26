import {Builder} from './builder'
import type {SanityString} from '../defs'

export class StringBuilder extends Builder<string> implements SanityString {
  typeName = 'string' as const
}

const STRING_BUILDER = new StringBuilder()
export function string() {
  return STRING_BUILDER
}
