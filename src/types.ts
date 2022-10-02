import type {ObjectTypeDef} from "./defs"
import {GroupUnderscoreKeys, Merge} from "./utils"

type MaybeAddKey<T extends any> = T extends Array<infer E>
  ? GroupUnderscoreKeys<Merge<MaybeAddKeyToArrayProps<E>, {_key: string}>>[]
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
