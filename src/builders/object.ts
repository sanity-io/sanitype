import {OutputFromShape, SanityObject, SanityObjectShape, UndefinedOptional,} from "../defs"
import {Builder} from "./builder"
import {ValidFieldName} from "../utils/utilTypes"

export type SafeObject<Type, Allowed extends string = never> = {
  [Property in keyof Type]: Property extends Allowed
    ? Type[Property]
    : Type[ValidFieldName<Property>]
}

class ObjectBuilder<
    Shape extends SanityObjectShape = SanityObjectShape,
    Output = UndefinedOptional<OutputFromShape<Shape>>,
  >
  extends Builder<Output>
  implements SanityObject<Shape, Output>
{
  typeName = "object" as const
  constructor(public shape: Shape) {
    super()
  }

  extend<Shape2 extends SanityObjectShape>(shape2: Shape2) {
    return new ObjectBuilder({...this.shape, ...shape2})
  }
}

export function object<
  Def extends SanityObjectShape = SanityObjectShape,
  Output = UndefinedOptional<OutputFromShape<Def>>,
>(shape: SafeObject<Def, "_type">) {
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
