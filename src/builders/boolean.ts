import {SanityBoolean, SanityNumber, SanityString} from "../defs.js"
import {Builder} from "./builder.js"

class BooleanBuilder
  extends Builder<boolean, boolean>
  implements SanityBoolean
{
  typeName = "boolean" as const
  constructor() {
    super(false)
  }
}

const BOOLEAN_BUILDER = new BooleanBuilder()

export function boolean() {
  return BOOLEAN_BUILDER
}
