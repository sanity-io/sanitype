import {
  SanityAny,
  SanityBoolean,
  SanityLazy,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityObjectShape,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityString,
  SanityType,
  SanityUnion,
} from "./defs2"
import {ArrayCreator} from "./factories"

const throwOnOutputAccess = {
  get output(): any {
    throw new Error("This method is not defined runtime")
  },
}

export function object<T extends SanityObjectShape>(shape: T): SanityObject<T> {
  return {
    typeName: "object",
    def: shape,
    ...throwOnOutputAccess,
  }
}

const STRING: SanityString = {
  typeName: "string",
  def: "",
  ...throwOnOutputAccess,
}

export function string(): SanityString {
  return STRING
}

const NUMBER: SanityNumber = {
  typeName: "number",
  def: 0,
  ...throwOnOutputAccess,
}
export function number<Def extends number>(): SanityNumber {
  return NUMBER
}

const BOOLEAN: SanityBoolean = {
  typeName: "boolean",
  def: false,
  ...throwOnOutputAccess,
}
export function boolean<Def extends boolean>(): SanityBoolean {
  return BOOLEAN
}
export function union<Def extends SanityType>(shapes: Def[]): SanityUnion<Def> {
  return {typeName: "union", def: shapes, ...throwOnOutputAccess}
}

export function literal<Def extends boolean | number | string>(
  literal: Def,
): SanityLiteral<Def> {
  return {
    typeName: "literal",
    def: literal,
    ...throwOnOutputAccess,
  }
}

export function lazy<T extends SanityAny>(creator: () => T): SanityLazy<T> {
  return {
    typeName: "lazy",
    def: creator,
    ...throwOnOutputAccess,
  }
}

export function objectArray<
  ElementType extends SanityObject | SanityUnion<SanityObject>,
>(elementSchema: ElementType): SanityObjectArray<ElementType> {
  return {
    typeName: "objectArray",
    def: elementSchema,
    ...throwOnOutputAccess,
  }
}
export function primitiveArray<
  ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive>,
>(elementSchema: ElementType): SanityPrimitiveArray<ElementType> {
  return {
    typeName: "primitiveArray",
    def: elementSchema,
    ...throwOnOutputAccess,
  }
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
