import {
  OutputFromShape,
  SanityObject,
  SanityObjectShape,
  UndefinedOptional,
} from "../defs.js"
import {Builder} from "./builder.js"
import {string} from "./string.js"
import {ValidFieldName} from "../utils.js"

export type SafeObject<Type, Allowed extends string = never> = {
  [Property in keyof Type]: Property extends Allowed
    ? Type[Property]
    : Type[ValidFieldName<Property>]
}

class ObjectBuilder<
    Def extends SanityObjectShape = SanityObjectShape,
    Output = UndefinedOptional<OutputFromShape<Def>>,
  >
  extends Builder<Def, Output>
  implements SanityObject<Def, Output>
{
  typeName = "object" as const

  extend<Def2 extends SanityObjectShape>(def2: Def2) {
    return new ObjectBuilder({...this.def, ...def2})
  }
}

export function object<
  Def extends SanityObjectShape = SanityObjectShape,
  Output = UndefinedOptional<OutputFromShape<Def>>,
>(shape: SafeObject<Def, '_type'>) {
  return new ObjectBuilder(shape)
}

/**
 * @internal*/
export function _object<
  Def extends SanityObjectShape = SanityObjectShape,
  Output = UndefinedOptional<OutputFromShape<Def>>,
>(shape: Def) {
  return new ObjectBuilder(shape)
}
