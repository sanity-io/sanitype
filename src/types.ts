import {ObjectArrayType, ObjectTypeDef, Type} from "./zanity"

export type StringType = Type<string, string>
export type NumberType = Type<number, number>

type MaybeAddKey<T extends any> = T extends Array<infer ElementType>
  ? (ElementType & {_key: string})[]
  : T

export type MaybeAddKeyToArrayProps<T extends {[key: string]: any}> = {
  [key in keyof T]: MaybeAddKey<T[key]>
}

type WithKeys<T> = {[P in keyof T]: MaybeAddKey<T[P]>}

export type ObjectType<Output> = ObjectTypeDef<
  any,
  {
    [key in keyof Output]: MaybeAddKey<Output[key]>
  }
>

type O = WithKeys<{foo: Array<{bar: string}>}>
