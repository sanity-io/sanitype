import {
  SanityAny,
  SanityBoolean,
  SanityDocument,
  SanityLazy,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityObjectShape,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityReference,
  SanityString,
  SanityType,
  SanityUnion,
} from "./defs.js"
import {defineHiddenGetter} from "./utils.js"

export function object<T extends SanityObjectShape>(shape: T): SanityObject<T> {
  return disallowOutput({typeName: "object", def: shape})
}

const STRING: SanityString = disallowOutput({typeName: "string", def: ""})
export function string(): SanityString {
  return STRING
}

const NUMBER: SanityNumber = disallowOutput({typeName: "number", def: 0})
export function number<Def extends number>(): SanityNumber {
  return NUMBER
}

const BOOLEAN: SanityBoolean = disallowOutput({typeName: "boolean", def: false})
export function boolean<Def extends boolean>(): SanityBoolean {
  return BOOLEAN
}
export function union<Def extends SanityType>(shapes: Def[]): SanityUnion<Def> {
  return disallowOutput({typeName: "union", def: shapes})
}

export function literal<Def extends boolean | number | string>(
  literal: Def,
): SanityLiteral<Def> {
  return disallowOutput({typeName: "literal", def: literal})
}

export function lazy<T extends SanityAny>(creator: () => T): SanityLazy<T> {
  return disallowOutput({typeName: "lazy", def: creator})
}

export function objectArray<
  ElementType extends SanityObject | SanityUnion<SanityObject>,
>(elementSchema: ElementType): SanityObjectArray<ElementType> {
  return disallowOutput({typeName: "objectArray", def: elementSchema})
}
export function primitiveArray<
  ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive>,
>(elementSchema: ElementType): SanityPrimitiveArray<ElementType> {
  return disallowOutput({typeName: "primitiveArray", def: elementSchema})
}

function isObjectArray(
  elementSchema:
    | SanityObject
    | SanityUnion<SanityObject>
    | SanityPrimitive
    | SanityUnion<SanityPrimitive>,
): elementSchema is SanityObject | SanityUnion<SanityObject> {
  return true
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
  return isObjectArray(elementSchema)
    ? objectArray(elementSchema)
    : primitiveArray(elementSchema)
}

export function document<Name extends string, Shape extends SanityObjectShape>(
  name: Name,
  shape: Shape,
) {
  return object({
    _type: literal(name),
    _id: string(),
    _createdAt: string(),
    _updatedAt: string(),
    _rev: string(),
    ...shape,
  })
}

const referenceShape = object({
  _type: literal("reference"),
  _ref: string(),
  _weak: boolean(),
})

export function reference<RefType extends SanityDocument>(
  to: RefType,
): SanityReference<RefType> {
  return disallowOutput({
    typeName: "object",
    def: referenceShape.def,
    referenceType: to,
  })
}

function disallowOutput<T>(target: T): T & {output: never} {
  return defineHiddenGetter(target, "output", () => {
    throw new Error("This method is not defined runtime")
  }) as T & {output: never}
}
