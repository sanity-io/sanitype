import {ObjectTypeDef, TypeDef} from "./zanity"

export type StringType = TypeDef<string, string>
export type NumberType = TypeDef<number, number>
export type BooleanType = TypeDef<boolean, boolean>

type MaybeAddKey<T extends any> = T extends Array<infer E>
  ? (MaybeAddKeyToArrayProps<E> & {_key: string})[]
  : T

export type MaybeAddKeyToArrayProps<T extends any> = T extends {
  [key: string]: any
}
  ? {
      [key in keyof T]: MaybeAddKey<T[key]>
    }
  : T

export type Lazy<Output> = ObjectTypeDef<
  any,
  {
    [key in keyof Output]: MaybeAddKey<Output[key]>
  }
>
