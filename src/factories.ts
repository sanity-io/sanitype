import {
  SanityAny,
  SanityBoolean,
  SanityLazy,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityObjectLike,
  SanityObjectShape,
  SanityOptional,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityReference,
  SanityString,
  SanityType,
  SanityUnion,
} from "./defs.js"
import {defineNonEnumerableGetter, ValidFieldName} from "./utils.js"
import {isItemObjectArrayCompatible, isUnionSchema} from "./asserters.js"
import {SanityDocumentValue} from "./valueTypes.js"

export function object<T extends SanityObjectShape>(shape: T) {
  return _object(shape)
}

/**
 * @internal*/
export function _object<T extends SanityObjectShape>(
  shape: T,
): SanityObject<T> {
  return throwOnOutputAccess({typeName: "object", def: shape})
}

const STRING: SanityString = throwOnOutputAccess({typeName: "string", def: ""})
export function string(): SanityString {
  return STRING
}

const NUMBER: SanityNumber = throwOnOutputAccess({typeName: "number", def: 0})
export function number<Def extends number>(): SanityNumber {
  return NUMBER
}

const BOOLEAN: SanityBoolean = throwOnOutputAccess({
  typeName: "boolean",
  def: false,
})
export function boolean<Def extends boolean>(): SanityBoolean {
  return BOOLEAN
}
export function union<Def extends SanityType>(
  schemas: Def[],
): SanityUnion<Def> {
  return throwOnOutputAccess({typeName: "union", def: schemas})
}

export function literal<Def extends boolean | number | string>(
  literal: Def,
): SanityLiteral<Def> {
  return throwOnOutputAccess({typeName: "literal", def: literal})
}

export function lazy<T extends SanityAny>(creator: () => T): SanityLazy<T> {
  return throwOnOutputAccess({typeName: "lazy", def: creator})
}
export function optional<T extends SanityType>(def: T): SanityOptional<T> {
  return throwOnOutputAccess({typeName: "optional", def})
}

function addKeyProperty<
  T extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(target: T): T {
  return isUnionSchema(target)
    ? {...target, def: target.def.map(addKeyProperty)}
    : {...target, def: {...target.def, _key: string()}}
}
export function objectArray<
  ElementType extends SanityObjectLike | SanityUnion<SanityObjectLike>,
>(elementSchema: ElementType): SanityObjectArray<ElementType> {
  return throwOnOutputAccess({
    typeName: "objectArray",
    def: addKeyProperty(elementSchema),
  })
}
export function primitiveArray<
  ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive>,
>(elementSchema: ElementType): SanityPrimitiveArray<ElementType> {
  return throwOnOutputAccess({typeName: "primitiveArray", def: elementSchema})
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

type ExtractValidFields<T extends keyof any> = T extends string
  ? T extends ValidFieldName<T>
    ? T
    : never
  : never

type SafeObject<Type, Allowed extends string = never> = {
  [Property in keyof Type]: Property extends Allowed
    ? Type[Property]
    : Type[ValidFieldName<Property>]
}

export function document<Shape extends SanityObjectShape>(
  shape: SafeObject<Shape, "_id" | "_type"> & {
    _id?: SanityLiteral<string> | SanityString
    _type: SanityLiteral<string>
  },
) {
  return _object({
    _id: string(),
    _createdAt: string(),
    _updatedAt: string(),
    _rev: string(),
    ...shape,
  })
}

const referenceShape = _object({
  _type: literal("reference"),
  _ref: string(),
  _weak: boolean(),
})

export function reference<RefType extends SanityType<SanityDocumentValue>>(
  to: RefType,
): SanityReference<RefType> {
  return throwOnOutputAccess({
    typeName: "reference",
    def: referenceShape.def,
    referenceType: to,
  }) as any as SanityReference<RefType>
}

function throwOnOutputAccess<T>(target: T): T & {output: never} {
  return defineNonEnumerableGetter(target, "output", () => {
    throw new Error("This method is not defined runtime")
  }) as T & {output: never}
}
