import {
  BooleanTypeDef,
  LiteralTypeDef,
  NumberTypeDef,
  ObjectArrayTypeDef,
  ObjectTypeDef,
  DocumentTypeDef,
  PrimitiveArrayTypeDef,
  PrimitiveTypeDef,
  ReferenceTypeDef,
  FieldsDef,
  StringTypeDef,
  TypeDef,
  UnionTypeDef,
  ReferenceShape,
  LazyTypeDef,
} from "./defs"
import {Lazy} from "./types"

export function document<N extends string, T extends FieldsDef>(
  name: N,
  shape: T,
): DocumentTypeDef<N, T> {
  return {
    typeName: "document",
    def: {_type: literal(name), ...shape},
    output: throwIfAccessed,
  }
}

export function union<Def extends TypeDef>(shapes: Def[]): UnionTypeDef<Def> {
  return {typeName: "union", def: shapes, output: throwIfAccessed}
}

export function object<T extends FieldsDef>(shape: T): ObjectTypeDef<T> {
  return {
    typeName: "object",
    def: shape,
    output: throwIfAccessed,
  }
}

export function objectArray<
  Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef>,
>(elementSchema: Def): ObjectArrayTypeDef<Def> {
  return {
    typeName: "objectArray",
    def: elementSchema,
    output: throwIfAccessed,
  }
}

export function primitiveArray<
  Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef>,
>(elementSchema: Def): PrimitiveArrayTypeDef<Def> {
  return {
    typeName: "primitiveArray",
    def: elementSchema,
    output: throwIfAccessed,
  }
}

function isPrimitiveTypeDef(typeDef: TypeDef): typeDef is PrimitiveTypeDef {
  return (
    typeDef.typeName === "number" ||
    typeDef.typeName === "boolean" ||
    typeDef.typeName === "string"
  )
}
function isObjectTypeDef(typeDef: TypeDef): typeDef is ObjectTypeDef {
  return typeDef.typeName === "object"
}

function isUnionType(typeDef: TypeDef): typeDef is UnionTypeDef {
  return typeDef.typeName === "union"
}

function isObjectUnion(
  typeDef: UnionTypeDef,
): typeDef is UnionTypeDef<ObjectTypeDef> {
  return typeDef.def.every(unionDef => isObjectTypeDef(unionDef))
}

function isObjectArray(
  elementSchema:
    | ObjectTypeDef
    | UnionTypeDef<ObjectTypeDef>
    | PrimitiveTypeDef
    | UnionTypeDef<PrimitiveTypeDef>,
): elementSchema is ObjectTypeDef | UnionTypeDef<ObjectTypeDef> {
  return true
}
function isPrimitiveArray(
  elementSchema:
    | ObjectTypeDef
    | UnionTypeDef<ObjectTypeDef>
    | PrimitiveTypeDef
    | UnionTypeDef<PrimitiveTypeDef>,
): elementSchema is PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef> {
  return true
}

export function _array<Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef>>(
  elementSchema: ObjectTypeDef | UnionTypeDef<ObjectTypeDef>,
): ObjectArrayTypeDef
export function _array<
  Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef>,
>(elementSchema: Def): PrimitiveArrayTypeDef<Def>
export function _array(
  elementSchema:
    | ObjectTypeDef
    | UnionTypeDef<ObjectTypeDef>
    | PrimitiveTypeDef
    | UnionTypeDef<PrimitiveTypeDef>,
) {
  return isObjectArray(elementSchema)
    ? {
        typeName: "objectArray",
        def: elementSchema,
        output: throwIfAccessed,
      }
    : {
        typeName: "primitiveArray",
        def: elementSchema,
        output: throwIfAccessed,
      }
}

export interface ArrayCreator {
  <Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef>>(
    elementSchema: Def,
  ): ObjectArrayTypeDef<Def>

  <Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef>>(
    elementSchema: Def,
  ): PrimitiveArrayTypeDef<Def>
}
export const array: ArrayCreator = _array

const throwIfAccessed: any = () => {
  throw new Error("This method is not defined runtime")
}

const STRING: StringTypeDef = {
  typeName: "string",
  def: "",
  output: throwIfAccessed,
}
export function string<Def extends string>(): StringTypeDef {
  return STRING
}

const NUMBER: NumberTypeDef = {
  typeName: "number",
  def: 0,
  output: throwIfAccessed,
}
export function number<Def extends number>(): NumberTypeDef {
  return NUMBER
}

const BOOLEAN: BooleanTypeDef = {
  typeName: "boolean",
  def: false,
  output: throwIfAccessed,
}
export function boolean<Def extends boolean>(): BooleanTypeDef {
  return BOOLEAN
}
export function literal<Def extends boolean | number | string>(
  literal: Def,
): LiteralTypeDef<Def> {
  return {
    typeName: "literal",
    def: literal,
    output: throwIfAccessed,
  }
}

const referenceShape = {
  _type: literal("reference"),
  _ref: string(),
  _weak: boolean(),
}

export function reference<RefType extends DocumentTypeDef<any>>(
  to: RefType,
): ReferenceTypeDef<RefType> {
  return {
    typeName: "object",
    def: referenceShape,
    referenceType: to,
    output: throwIfAccessed,
  }
}

export function lazy<Output extends any, T extends TypeDef>(
  getter: () => T,
): LazyTypeDef<T> {
  return getter
}
