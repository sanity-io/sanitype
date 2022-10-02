import {
  BooleanTypeDef,
  LiteralTypeDef,
  NumberTypeDef,
  ObjectArrayTypeDef,
  ObjectTypeDef,
  PrimitiveArrayTypeDef,
  PrimitiveTypeDef,
  ReferenceTypeDef,
  Shape,
  StringTypeDef,
  TypeDef,
  UnionTypeDef,
} from "./defs"

export function document<N extends string, T extends Shape<any>>(
  name: N,
  shape: T,
) {
  return object({
    ...shape,
  })
}

export declare function lazy<Output extends any, T extends TypeDef>(
  getter: () => T,
): T

export declare function union<Def extends TypeDef>(
  shapes: Def[],
): UnionTypeDef<Def>

export declare function object<Def extends Shape<any>>(
  shape: Def,
): ObjectTypeDef<Def>

export declare function objectArray<
  Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef>,
>(elementSchema: Def): ObjectArrayTypeDef<Def>

export declare function primitiveArray<
  Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef>,
>(elementSchema: Def): PrimitiveArrayTypeDef<Def>

export declare interface ArrayCreator {
  <Def extends ObjectTypeDef | UnionTypeDef<ObjectTypeDef>>(
    elementSchema: Def,
  ): ObjectArrayTypeDef<Def>
  <Def extends PrimitiveTypeDef | UnionTypeDef<PrimitiveTypeDef>>(
    elementSchema: Def,
  ): PrimitiveArrayTypeDef<Def>
}

export declare const array: ArrayCreator

export declare function string<Def extends string>(): StringTypeDef
export declare function literal<Def extends boolean | number | string>(
  literal: Def,
): LiteralTypeDef<Def>

export declare function number<Def extends number>(): NumberTypeDef
export declare function boolean<Def extends boolean>(): BooleanTypeDef

export declare function reference<RefType extends ObjectTypeDef>(
  to: RefType,
): ReferenceTypeDef<RefType>
