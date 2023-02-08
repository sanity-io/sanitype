import {parse} from "../parse.js"
import {optional} from "./optional.js"

export abstract class Builder<Def, Output> {
  abstract typeName: string
  constructor(public def: Def) {}
  get output(): Output {
    throw new Error("This method is not defined runtime")
  }
  parse(input: unknown): Output {
    return parse(this, input)
  }

  optional() {
    return optional(this)
  }
}
