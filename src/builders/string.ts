import {SanityString} from "../defs"
import {Builder} from "./builder"

class StringBuilder extends Builder<string> implements SanityString {
  typeName = "string" as const
}

const STRING_BUILDER = new StringBuilder()
export function string() {
  return STRING_BUILDER
}
