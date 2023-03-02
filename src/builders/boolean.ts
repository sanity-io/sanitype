import {SanityBoolean} from "../defs"
import {Builder} from "./builder"

class BooleanBuilder extends Builder<boolean> implements SanityBoolean {
  typeName = "boolean" as const
}

const BOOLEAN_BUILDER = new BooleanBuilder()

export function boolean() {
  return BOOLEAN_BUILDER
}
