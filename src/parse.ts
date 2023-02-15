import {
  Infer,
  INTERNAL_REF_TYPE_SCHEMA,
  OutputOf,
  SanityBoolean,
  SanityDocument,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityReference,
  SanityString,
  SanityType,
  SanityUnion,
} from "./defs.js"
import {inspect} from "util"
import {
  isBooleanSchema,
  isDocumentSchema,
  isLiteralSchema,
  isNumberSchema,
  isObjectArraySchema,
  isObjectSchema,
  isReferenceSchema,
  isStringSchema,
  isUnionSchema,
} from "./asserters.js"
import {defineNonEnumerableGetter} from "./utils/defineNonEnumerableGetter.js"
import {referenceBase} from "./shapeDefs.js"

type Path = Array<string | number | {_key: string}>

type ErrorCode =
  | "INVALID_TYPE"
  | "INVALID_UNION"
  | "ARRAY_ELEMENT_NOT_KEYED_OBJECT"
interface ParseErrorDetails {
  path: Path
  code: ErrorCode
  message: string
}
export type ParseOk<T> = {status: "ok"; value: T}
export type ParseFail = {status: "fail"; errors: ParseErrorDetails[]}

export type ParseResult<T> = ParseOk<T> | ParseFail

function getLazySchema(schema: SanityType): SanityType {
  if (schema.typeName === "lazy") {
    if ((schema as any)._cache === undefined) {
      ;(schema as any)._cache = schema.def()
    }
    return (schema as any)._cache
  }
  return schema
}

export function safeParse<T extends SanityType>(
  _schema: T,
  input: unknown,
): ParseResult<Infer<T>> {
  const schema = getLazySchema(_schema)
  if (isStringSchema(schema)) {
    return parseString(schema, input) as any
  }
  if (isNumberSchema(schema)) {
    return parseNumber(schema, input) as any
  }
  if (isBooleanSchema(schema)) {
    return parseBoolean(schema, input) as any
  }
  if (isReferenceSchema(schema)) {
    return parseReference(schema, input) as any
  }
  if (isObjectSchema(schema)) {
    return parseObject(schema, input) as any
  }
  if (isDocumentSchema(schema)) {
    return parseDocument(schema, input) as any
  }
  if (isLiteralSchema(schema)) {
    return parseLiteral(schema, input) as any
  }
  if (isObjectArraySchema(schema)) {
    return parseObjectArray(schema, input) as any
  }
  if (isUnionSchema(schema)) {
    return parseUnion(schema, input)
  }
  return {
    status: "fail",
    errors: [
      {
        path: [],
        code: "INVALID_TYPE",
        message: `Invalid input: ${inspect(input)}`,
      },
    ],
  }
}
export class ParseError extends Error {
  constructor(public errors: ParseErrorDetails[]) {
    super(
      `Invalid input: ${errors[0]?.message || "<unknown>"} (+ ${
        errors.length - 1
      })`,
    )
  }
}

export function parse<T extends SanityType>(
  schema: T,
  input: unknown,
): Infer<T> {
  const safeResult = safeParse(schema, input)
  if (safeResult.status === "fail") {
    throw new ParseError(safeResult.errors)
  }
  return safeResult.value
}
export function parseString(
  schema: SanityString,
  input: unknown,
): ParseResult<string> {
  return typeof input === "string"
    ? {status: "ok", value: input}
    : {
        status: "fail",
        errors: [
          {
            path: [],
            code: "INVALID_TYPE",
            message: `Expected a string but got "${inspect(input)}"`,
          },
        ],
      }
}

export function parseNumber(
  schema: SanityNumber,
  input: unknown,
): ParseResult<number> {
  return typeof input === "number"
    ? {status: "ok", value: input}
    : {
        status: "fail",
        errors: [
          {
            path: [],
            code: "INVALID_TYPE",
            message: `Expected a number but got "${inspect(input)}"`,
          },
        ],
      }
}
export function parseBoolean(
  schema: SanityBoolean,
  input: unknown,
): ParseResult<boolean> {
  return typeof input === "boolean"
    ? {status: "ok", value: input}
    : {
        status: "fail",
        errors: [
          {
            path: [],
            code: "INVALID_TYPE",
            message: `Expected a boolean but got "${inspect(input)}"`,
          },
        ],
      }
}

export function parseLiteral<S extends SanityLiteral<any>>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  return input === schema.def
    ? {status: "ok", value: input}
    : {
        status: "fail",
        errors: [
          {
            path: [],
            code: "INVALID_TYPE",
            message: `Expected "${schema.def}" but got "${inspect(input)}"`,
          },
        ],
      }
}

export function parseReference<S extends SanityReference<any>>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  const parsed = parseObject(referenceBase, input)
  if (parsed.status === "fail") {
    return parsed
  }
  return {
    ...parsed,
    value: defineNonEnumerableGetter(
      parsed.value,
      INTERNAL_REF_TYPE_SCHEMA,
      () => schema.def,
    ),
  }
}

export function parseUnion<S extends SanityUnion<any>>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  const errors: ParseErrorDetails[] = []
  for (const unionTypeDef of schema.def) {
    // todo: optimize this by looking at the value and excluding the ones that can't match structurally
    //  e.g. introduce a "shallow fast parse" that fails fast
    const result = safeParse(unionTypeDef, input)
    if (result.status === "ok") {
      return result
    }
    errors.push(...result.errors)
  }
  return {
    status: "fail",
    errors: [
      {
        code: "INVALID_UNION",
        path: [],
        message: "Input doesn't match any of the valid union types",
      },
      ...errors,
    ],
  }
}

type PlainObject = {[key: string]: unknown}
const isPlainObject = (value: unknown): value is {[key: string]: unknown} => {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}
export function parseDocument<S extends SanityDocument>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  return parseObject(schema, input)
}

export function parseObject<S extends SanityObject | SanityDocument>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  const keys: string[] = Object.keys(schema.def)

  if (!isPlainObject(input)) {
    return {
      status: "fail",
      errors: [
        {
          path: [],
          code: "INVALID_TYPE",
          message: `Expected an object with keys {${keys.join(
            ", ",
          )}} but got "${inspect(input)}"`,
        },
      ],
    }
  }
  const errors: ParseErrorDetails[] = []
  const value: PlainObject = {}
  keys.forEach(key => {
    // todo: figure out how to deal with null - should it be allowed? check what zod does
    if (!(key in input) || input[key] === undefined) {
      return
    }
    const parsed = safeParse(schema.def[key]!, input[key])
    if (parsed.status === "fail") {
      errors.push(
        ...parsed.errors.map(err => ({
          ...err,
          path: [key, ...err.path],
        })),
      )
    } else {
      value[key] = parsed.value
    }
  })
  if (errors.length > 0) {
    return {status: "fail", errors}
  }
  return {status: "ok", value}
}

function isKeyedObject(value: unknown): value is {_key: string} {
  return isPlainObject(value) && typeof value._key === "string"
}

export function parseObjectArray<S extends SanityObjectArray>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  if (!Array.isArray(input)) {
    return {
      status: "fail",
      errors: [
        {
          path: [],
          code: "INVALID_TYPE",
          message: `Expected an array but got "${inspect(typeof input)}"`,
        },
      ],
    }
  }

  const errors: ParseErrorDetails[] = []
  const value = (input as unknown[]).map((item, index) => {
    if (!isKeyedObject(item)) {
      errors.push({
        code: "ARRAY_ELEMENT_NOT_KEYED_OBJECT",
        path: [index],
        message: 'Expected an object with a "_key" property',
      })
      return
    }
    const parsed = safeParse(schema.def, item)
    if (parsed.status === "fail") {
      errors.push(
        ...parsed.errors.map(err => ({
          ...err,
          path: [item._key, ...err.path],
        })),
      )
    } else {
      return parsed.value
    }
  }) as {_key: string}[]

  if (errors.length > 0) {
    return {status: "fail", errors}
  }
  return {status: "ok", value}
}
