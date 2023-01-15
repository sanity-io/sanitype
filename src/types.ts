import {Combine, GroupUnderscoreKeys} from "./utils.js"

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

