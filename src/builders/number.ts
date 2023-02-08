import {SanityNumber} from "../defs.js"
import {Builder} from "./builder.js"

class NumberBuilder extends Builder<number, number> implements SanityNumber {
  typeName = "number" as const
  constructor() {
    super(0)
  }
}

const NUMBER_BUILDER = new NumberBuilder()
export function number() {
  return NUMBER_BUILDER
}
