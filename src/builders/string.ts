import {SanityString} from "../defs.js"
import {Builder} from "./builder.js"

class StringBuilder extends Builder<string> implements SanityString {
  typeName = "string" as const
}

const STRING_BUILDER = new StringBuilder()
export function string() {
  return STRING_BUILDER
}
