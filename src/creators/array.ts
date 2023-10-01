import {isItemObjectArrayCompatible, isObjectUnionSchema} from '../asserters'
import {defineType} from '../helpers/defineType'
import {string} from './string'
import type {
  SanityLiteral,
  SanityObjectArray,
  SanityObjectLike,
  SanityObjectUnion,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityPrimitiveUnion,
} from '../defs'

function addKeyProperty<T extends SanityObjectUnion | SanityObjectLike>(
  target: T,
): T {
  return isObjectUnionSchema(target)
    ? {...target, union: target.union.map(addKeyProperty)}
    : {...target, shape: {...target.shape, _key: string()}}
}

export function objectArray<
  ElementType extends SanityObjectLike | SanityObjectUnion,
>(elementSchema: ElementType): SanityObjectArray<ElementType> {
  return defineType({
    typeName: 'objectArray',
    element: addKeyProperty(elementSchema),
  })
}

export function primitiveArray<
  ElementType extends SanityPrimitive | SanityLiteral | SanityPrimitiveUnion,
>(elementSchema: ElementType): SanityPrimitiveArray<ElementType> {
  return defineType({typeName: 'primitiveArray', element: elementSchema})
}

export function array<Def extends SanityObjectLike | SanityObjectUnion>(
  elementSchema: Def,
): SanityObjectArray<Def>
export function array<Def extends SanityPrimitive | SanityPrimitiveUnion>(
  elementSchema: Def,
): SanityPrimitiveArray<Def>
export function array(
  elementSchema:
    | SanityObjectLike
    | SanityObjectUnion
    | SanityPrimitive
    | SanityPrimitiveUnion,
) {
  return isItemObjectArrayCompatible(elementSchema)
    ? objectArray(elementSchema)
    : primitiveArray(elementSchema)
}
