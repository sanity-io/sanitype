import {
  isItemObjectArrayCompatible,
  isNeverSchema,
  isObjectUnionSchema,
} from '../asserters'
import {
  type SanityLiteral,
  type SanityNever,
  type SanityObjectArray,
  type SanityObjectLike,
  type SanityObjectUnion,
  type SanityPrimitive,
  type SanityPrimitiveArray,
  type SanityPrimitiveUnion,
} from '../defs'
import {defineType} from '../helpers/defineType'
import {string} from './string'

function addKeyProperty<T extends SanityObjectUnion | SanityObjectLike>(
  target: T,
): T {
  return isObjectUnionSchema(target)
    ? {
        ...target,
        union: target.union.map(unionType =>
          isNeverSchema(unionType) ? unionType : addKeyProperty(unionType),
        ),
      }
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
  ElementType extends
    | SanityPrimitive
    | SanityLiteral
    | SanityPrimitiveUnion
    | SanityNever,
>(elementSchema: ElementType): SanityPrimitiveArray<ElementType> {
  return defineType({typeName: 'primitiveArray', element: elementSchema})
}

export function array<Def extends SanityObjectLike | SanityObjectUnion>(
  elementSchema: Def,
): SanityObjectArray<Def>
export function array<Def extends SanityPrimitive | SanityPrimitiveUnion>(
  elementSchema: Def,
): SanityPrimitiveArray<Def>
export function array<Def extends SanityNever>(
  elementSchema: Def,
): SanityPrimitiveArray<Def>
export function array(
  elementSchema:
    | SanityObjectLike
    | SanityObjectUnion
    | SanityPrimitive
    | SanityNever
    | SanityPrimitiveUnion,
) {
  return isItemObjectArrayCompatible(elementSchema)
    ? objectArray(elementSchema)
    : primitiveArray(elementSchema)
}
