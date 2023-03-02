import {SanityNumber} from "../defs"
import {Builder} from "./builder"

class NumberBuilder extends Builder<number> implements SanityNumber {
  typeName = "number" as const
}

const NUMBER_BUILDER = new NumberBuilder()
export function number() {
  return NUMBER_BUILDER
}
