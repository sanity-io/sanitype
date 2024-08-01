import {defineType} from '../helpers/defineType'
import {
  type OutputFromShape,
  type SanityObject,
  type SanityObjectShape,
  type UndefinedOptional,
} from '../defs'
import {type ValidFieldName} from '../helpers/utilTypes'

export type SafeObject<Type, Allowed extends string = never> = {
  [Property in keyof Type]: Property extends Allowed
    ? Type[Property]
    : Type[ValidFieldName<Property>]
}

export function object<
  Shape extends SafeObject<Shape, '_type'> = SanityObjectShape,
>(
  shape: Shape,
): SanityObject<Shape, UndefinedOptional<OutputFromShape<Shape>>> {
  return defineType({typeName: 'object', shape})
}
