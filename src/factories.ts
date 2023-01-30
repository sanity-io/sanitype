import {
  SanityAny,
  SanityBoolean,
  SanityDocument,
  SanityDocumentShape,
  SanityLazy,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityObjectShape,
  SanityOptional,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityReference,
  SanityString,
  SanityType,
  SanityUnion,
} from "./defs.js"
import {defineHiddenGetter} from "./utils.js"
import {isItemObjectArrayCompatible, isUnionSchema} from "./asserters.js"

export function object<T extends SanityObjectShape>(shape: T): SanityObject<T> {
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

function addKeyProperty<T extends SanityObject | SanityUnion<SanityObject>>(
  target: T,
): T {
  return isUnionSchema(target)
    ? {...target, def: target.def.map(addKeyProperty)}
    : {...target, def: {...target.def, _key: string()}}
}
export function objectArray<
  ElementType extends SanityObject | SanityUnion<SanityObject>,
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

export function array<Def extends SanityObject | SanityUnion<SanityObject>>(
  elementSchema: Def,
): SanityObjectArray<Def>
export function array<
  Def extends SanityPrimitive | SanityUnion<SanityPrimitive>,
>(elementSchema: Def): SanityPrimitiveArray<Def>
export function array(
  elementSchema:
    | SanityObject
    | SanityUnion<SanityObject>
    | SanityPrimitive
    | SanityUnion<SanityPrimitive>,
) {
  return isItemObjectArrayCompatible(elementSchema)
    ? objectArray(elementSchema)
    : primitiveArray(elementSchema)
}

export function document<Name extends string, Shape extends SanityObjectShape>(
  name: Name,
  shape: Shape,
): SanityDocument<Name, Shape> {
  return object({
    _type: literal(name),
    _id: string(),
    _createdAt: string(),
    _updatedAt: string(),
    _rev: string(),
    ...shape,
  }) as any as SanityDocument<Name, Shape>
}

const referenceShape = object({
  _type: literal("reference"),
  _ref: string(),
  _weak: boolean(),
})

export function reference<RefType extends SanityDocument>(
  to: RefType,
): SanityReference<RefType> {
  return throwOnOutputAccess({
    typeName: "object",
    def: referenceShape.def,
    referenceType: to,
  })
}

function throwOnOutputAccess<T>(target: T): T & {output: never} {
  return defineHiddenGetter(target, "output", () => {
    throw new Error("This method is not defined runtime")
  }) as T & {output: never}
}
