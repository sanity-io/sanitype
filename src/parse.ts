import {
  Infer,
  OutputOf,
  SanityLazy,
  SanityObject,
  SanityString,
  SanityType,
} from "./defs.js"
import {inspect} from "util"

type Path = Array<string | number | {_key: string}>

type ErrorCode = "INVALID_TYPE" | "INVALID_UNION"
interface ParseErrorDetails {
  path: Path
  code: ErrorCode
  message: string
}
type ParseOk<T> = {status: "ok"; value: T}
type ParseFail = {status: "fail"; errors: ParseErrorDetails[]}

type ParseResult<T> = ParseOk<T> | ParseFail

function isStringSchema(schema: SanityType): schema is SanityString {
  return schema.typeName === "string"
}
function isObjectSchema(schema: SanityType): schema is SanityObject {
  return schema.typeName === "object"
}

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
  if (isObjectSchema(schema)) {
    return parseObject(schema, input) as any
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
class ParseError extends Error {
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

type PlainObject = {[key: string]: unknown}
const isPlainObject = (value: unknown): value is {[key: string]: unknown} => {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}
export function parseObject<S extends SanityType | SanityObject>(
  schema: S,
  input: unknown,
): S extends SanityType<infer T> ? ParseResult<T> : ParseResult<OutputOf<S>>
export function parseObject<S extends SanityObject>(
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
