import {defineType} from '../utils/defineType'
import type {OutputFromShape, SanityObject, SanityObjectShape} from '../defs'
import type {ValidFieldName} from '../utils/utilTypes'

export type SafeObject<Type, Allowed extends string = never> = {
  [Property in keyof Type]: Property extends Allowed
    ? Type[Property]
    : Type[ValidFieldName<Property>]
}

export function object<
  Shape extends SanityObjectShape = SanityObjectShape,
  Output = OutputFromShape<Shape>,
>(shape: SafeObject<Shape, '_type'>): SanityObject<Shape, Output> {
  return defineType({typeName: 'object', shape})
}
