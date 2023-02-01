/**
 *  Generic utility types
 */

/**
 * Combines two object types into a single, uniform type instead of an intersection of the two
 */
export type Combine<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K]
} & B extends infer O
  ? {[K in keyof O]: O[K]}
  : never

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

export function defineNonEnumerableGetter<T, Prop extends keyof any>(
  target: T,
  name: Prop,
  getter: () => any,
): T & {[key in Prop]: any} {
  return Object.defineProperty(target, name, {
    get: getter,
    enumerable: false,
    configurable: false,
  }) as any
}

type AZ =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"

type Digits = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

export type ValidFieldChar = AZ | "_" | "-" | Digits
export type ValidFirsChar = AZ

type HasValidFirstChar<T extends string> = T extends `_${infer V}`
  ? true
  : false

type GetFirstChar<T extends string> =
  T extends `${infer First}${infer Remainder}` ? First : T

type FieldErrorCode =
  | "FIELD_NAME_CANNOT_CONTAIN_CHARACTER"
  | "FIELD_NAME_CANNOT_BEGIN_WITH_UNDERSCORE"
type FieldError<Code extends FieldErrorCode, Message extends string> = {
  code: Code
  message: Message
}

export type ValidateKeyOf<T extends keyof any> = T extends string
  ? ValidateFieldName<T>
  : never

export type ValidateFieldName<T extends string> =
  Uppercase<GetFirstChar<T>> extends ValidFirsChar
    ? ValidateFieldChars<T>
    : FieldError<
        "FIELD_NAME_CANNOT_BEGIN_WITH_UNDERSCORE",
        `Invalid field name ${T}: Underscore field names are reserved for system fields`
      >

export type ValidateFieldChars<T extends string> = T extends ""
  ? true
  : T extends `${infer First}${infer Remainder}`
  ? Uppercase<First> extends ValidFieldChar
    ? ValidateFieldChars<Remainder>
    : FieldError<
        "FIELD_NAME_CANNOT_CONTAIN_CHARACTER",
        `Invalid character in field name: '${First}'.`
      >
  : never
