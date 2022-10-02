import type {ObjectTypeDef} from "./defs"
import {GroupUnderscoreKeys, Combine} from "./utils"

type MaybeAddKey<T extends any> = T extends Array<infer E>
  ? GroupUnderscoreKeys<Combine<MaybeAddKeyToArrayProps<E>, {_key: string}>>[]
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
