/**
 *  Generic utility types
 */

import {any} from 'zod'
import type {SanityDocument, SanityObject} from '../defs'

/**
 * Combines two object types into a single, uniform type instead of an intersection of the two
 */
export type Combine<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K]
} & B extends infer O
  ? {[K in keyof O]: O[K]}
  : never

/**
 * Merges an intersection object type from {"foo": 1} & {"bar": 2} to {"foo": 1, "bar": 1}
 */
export type MergeObject<A> = A extends {[P in infer K]: unknown}
  ? {[Key in K]: A[Key]}
  : A

/**
 * Extracts all keys from an object type that starts with `_`
 */
export type UnderscoreKeys<T> = {
  [K in keyof T]: K extends `_${infer S}` ? K : never
}[keyof T]

/**
 * Groups keys of an object type so that underscore keys comes first and other keys comes after
 */
export type GroupUnderscoreKeys<T> = Combine<
  Pick<T, UnderscoreKeys<T>>,
  Omit<T, UnderscoreKeys<T>>
>

// eslint-disable-next-line @typescript-eslint/ban-types
export type OutputFormatFix = {}

export type AZ =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'

export type Digits = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

export type ValidFieldChar = AZ | '_' | '-' | Digits
export type ValidFirstChar = AZ

export type GetFirstChar<T extends string> =
  T extends `${infer First}${infer Remainder}` ? First : T

export type FieldErrorCode =
  | 'FIELD_NAME_CANNOT_CONTAIN_CHARACTER'
  | 'FIELD_NAME_CANNOT_BEGIN_WITH_UNDERSCORE'

export type FieldError<Code extends FieldErrorCode, Message extends string> = {
  code: Code
  message: Message
}

export type ValidateKeyOf<T extends keyof any> = T extends string
  ? ValidateFieldName<T>
  : never

export type ValidateFieldName<T extends string> = Uppercase<
  GetFirstChar<T>
> extends ValidFirstChar
  ? ValidateFieldChars<T>
  : FieldError<
      'FIELD_NAME_CANNOT_BEGIN_WITH_UNDERSCORE',
      `Invalid field name ${T}: Underscore field names are reserved for system fields`
    >

export type ValidateFieldChars<T extends string> = T extends ''
  ? true
  : T extends `${infer First}${infer Remainder}`
  ? Uppercase<First> extends ValidFieldChar
    ? ValidateFieldChars<Remainder>
    : FieldError<
        'FIELD_NAME_CANNOT_CONTAIN_CHARACTER',
        `Invalid character in field name: '${First}'.`
      >
  : never

export type ValidFieldName<T extends keyof any> = T extends string
  ? Uppercase<GetFirstChar<T>> extends ValidFirstChar
    ? ValidFieldChars<T> extends true
      ? T
      : never
    : never
  : never

export type ValidFieldChars<T extends string> = T extends ''
  ? true
  : T extends `${infer First}${infer Remainder}`
  ? Uppercase<First> extends ValidFieldChar
    ? ValidateFieldChars<Remainder>
    : FieldError<
        'FIELD_NAME_CANNOT_CONTAIN_CHARACTER',
        `Invalid character in field name: '${First}'.`
      >
  : never

type MaybeAddKey<T> = T extends Array<infer E>
  ? GroupUnderscoreKeys<Combine<MaybeAddKeyToArrayProps<E>, {_key: string}>>[]
  : T

export type MaybeAddKeyToArrayProps<T> = T extends {
  [key: string]: any
}
  ? {
      [key in keyof T]: MaybeAddKey<T[key]>
    }
  : T

export type GetShapeOf<T extends SanityObject | SanityDocument> =
  T extends SanityObject<infer Def>
    ? Def
    : T extends SanityDocument<infer Def>
    ? Def
    : never

export type ElementType<T extends any[]> = T extends (infer E)[] ? E : never
