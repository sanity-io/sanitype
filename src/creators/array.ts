import {isItemObjectArrayCompatible, isUnionSchema} from '../asserters'
import {defineType} from '../utils/defineType'
import {string} from './string'
import type {
  SanityObjectArray,
  SanityObjectLike,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityUnion,
} from '../defs'

function addKeyProperty<
  T extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(target: T): T {
  return isUnionSchema(target)
    ? {...target, union: target.union.map(addKeyProperty)}
    : {...target, shape: {...target.shape, _key: string()}}
}

export function objectArray<
  ElementType extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(elementSchema: ElementType): SanityObjectArray<ElementType> {
  return defineType({
    typeName: 'objectArray',
    element: addKeyProperty(elementSchema),
  })
}

export function primitiveArray<
  ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive>,
>(elementSchema: ElementType): SanityPrimitiveArray<ElementType> {
  return defineType({typeName: 'primitiveArray', element: elementSchema})
}

export function array<
  Def extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(elementSchema: Def): SanityObjectArray<Def>
export function array<
  Def extends SanityPrimitive | SanityUnion<SanityPrimitive>,
>(elementSchema: Def): SanityPrimitiveArray<Def>
export function array(
  elementSchema:
    | SanityObjectLike
    | SanityUnion<SanityObjectLike>
    | SanityPrimitive
    | SanityUnion<SanityPrimitive>,
) {
  return isItemObjectArrayCompatible(elementSchema)
    ? objectArray(elementSchema)
    : primitiveArray(elementSchema)
}
