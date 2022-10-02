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
} from "./defs"

export declare function document<N extends string, T extends FieldsDef>(
  name: N,
  shape: T,
): DocumentTypeDef<N, T>

export declare function union<Def extends TypeDef>(
  shapes: Def[],
): UnionTypeDef<Def>

export declare function object<T extends FieldsDef>(shape: T): ObjectTypeDef<T>

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

export declare function reference<RefType extends DocumentTypeDef<any>>(
  to: RefType,
): ReferenceTypeDef<RefType>

export declare function lazy<Output extends any, T extends TypeDef>(
  getter: () => T,
): T
