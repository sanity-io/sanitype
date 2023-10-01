import {INTERNAL_REF_TYPE_SCHEMA} from './defs'
import {
  isBooleanSchema,
  isDiscriminatedUnionSchema,
  isDocumentSchema,
  isLiteralSchema,
  isNumberSchema,
  isObjectArraySchema,
  isObjectSchema,
  isOptionalSchema,
  isPrimitiveArraySchema,
  isReferenceSchema,
  isStringSchema,
  isUnionSchema,
} from './asserters'
import {defineNonEnumerableGetter} from './helpers/defineNonEnumerableGetter'
import {referenceBase} from './shapeDefs'
import {getLazySchema} from './helpers/getLazySchema'
import {inspect} from './helpers/inspect'
import type {
  Infer,
  OutputOf,
  SanityBoolean,
  SanityDiscriminatedUnion,
  SanityDocument,
  SanityLiteral,
  SanityNumber,
  SanityObject,
  SanityObjectArray,
  SanityOptional,
  SanityPrimitiveArray,
  SanityReference,
  SanityString,
  SanityType,
  SanityUnion,
} from './defs'

export type Path = Array<string | number | {_key: string}>

export type ErrorCode =
  | 'INVALID_TYPE'
  | 'INVALID_UNION'
  | 'INVALID_DISCRIMINATED_UNION'
  | 'ARRAY_ELEMENT_NOT_KEYED_OBJECT'
export interface ParseErrorDetails {
  path: Path
  code: ErrorCode
  message: string
}
export type ParseOk<T> = {status: 'ok'; value: T}
export type ParseFail = {status: 'fail'; errors: ParseErrorDetails[]}

export type ParseResult<T> = ParseOk<T> | ParseFail

export function safeParse<T extends SanityType>(
  _schema: T,
  input: unknown,
): ParseResult<Infer<T>> {
  const schema = getLazySchema(_schema)
  if (isOptionalSchema(schema)) {
    return parseOptional(schema, input) as any
  }
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
  if (isPrimitiveArraySchema(schema)) {
    return parsePrimitiveArray(schema, input) as any
  }
  if (isDiscriminatedUnionSchema(schema)) {
    return parseDiscriminatedUnion(schema, input) as any
  }
  if (isUnionSchema(schema)) {
    return parseUnion(schema, input)
  }
  return {
    status: 'fail',
    errors: [
      {
        path: [],
        code: 'INVALID_TYPE',
        message: `Invalid input: ${inspect(input)}`,
      },
    ],
  }
}
export class ParseError extends Error {
  constructor(public errors: ParseErrorDetails[]) {
    const firstError = errors[0]
    const formattedError = [
      'Invalid input',
      firstError
        ? ` at "${firstError.path.join('.') || '<root>'}": ${
            firstError.message
          }`
        : ': <unknown>',
      errors.length > 1 ? ` (+ ${errors.length - 1})` : '',
    ]
    super(formattedError.join(''))
  }
}

export function parse<T extends SanityType>(
  schema: T,
  input: unknown,
): Infer<T> {
  const safeResult = safeParse(schema, input)
  if (safeResult.status === 'fail') {
    throw new ParseError(safeResult.errors)
  }
  return safeResult.value
}
export function parseString(
  schema: SanityString,
  input: unknown,
): ParseResult<string> {
  return typeof input === 'string'
    ? {status: 'ok', value: input}
    : {
        status: 'fail',
        errors: [
          {
            path: [],
            code: 'INVALID_TYPE',
            message: `Expected a string but got "${inspect(input)}"`,
          },
        ],
      }
}

export function parseNumber(
  schema: SanityNumber,
  input: unknown,
): ParseResult<number> {
  return typeof input === 'number'
    ? {status: 'ok', value: input}
    : {
        status: 'fail',
        errors: [
          {
            path: [],
            code: 'INVALID_TYPE',
            message: `Expected a number but got "${inspect(input)}"`,
          },
        ],
      }
}
export function parseBoolean(
  schema: SanityBoolean,
  input: unknown,
): ParseResult<boolean> {
  return typeof input === 'boolean'
    ? {status: 'ok', value: input}
    : {
        status: 'fail',
        errors: [
          {
            path: [],
            code: 'INVALID_TYPE',
            message: `Expected a boolean but got "${inspect(input)}"`,
          },
        ],
      }
}
export function parseOptional<T extends SanityType>(
  schema: SanityOptional<T>,
  input: unknown,
): ParseResult<T | undefined> {
  return input === undefined
    ? {status: 'ok', value: input}
    : safeParse(schema.type, input)
}

export function parseLiteral<S extends SanityLiteral<any>>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  return input === schema.value
    ? {status: 'ok', value: input}
    : {
        status: 'fail',
        errors: [
          {
            path: [],
            code: 'INVALID_TYPE',
            message: `Expected literal value "${
              schema.value
            }" but got "${inspect(input)}"`,
          },
        ],
      }
}

export function parseReference<S extends SanityReference<any>>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  const parsed = parseObject(referenceBase, input)
  if (parsed.status === 'fail') {
    return parsed
  }
  return {
    ...parsed,
    value: defineNonEnumerableGetter(
      parsed.value,
      INTERNAL_REF_TYPE_SCHEMA,
      () => schema.referenceType,
    ),
  }
}

export function parseUnion<S extends SanityUnion<any>>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  const errors: ParseErrorDetails[] = []
  for (const unionTypeDef of schema.union) {
    // todo: optimize this by looking at the value and excluding the ones that can't match structurally
    //  e.g. introduce a "shallow fast parse" that fails fast
    const result = safeParse(unionTypeDef, input)
    if (result.status === 'ok') {
      return result
    }
    errors.push(...result.errors)
  }
  return {
    status: 'fail',
    errors: [
      {
        code: 'INVALID_UNION',
        path: [],
        message: "Input doesn't match any of the valid union types",
      },
      ...errors,
    ],
  }
}
export function parseDiscriminatedUnion<S extends SanityDiscriminatedUnion>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  const discriminator = schema.discriminator
  if (!isPlainObject(input) || !(discriminator in input)) {
    return {
      status: 'fail',
      errors: [
        {
          code: 'INVALID_DISCRIMINATED_UNION',
          path: [],
          message: `Input must be an object with a "${schema.discriminator}" property`,
        },
      ],
    }
  }
  const discriminatorValue = input[discriminator]

  const unionSchema = schema.union.find(objectDef => {
    const discriminatorLiteral = objectDef.shape[discriminator]!
    return (
      isLiteralSchema(discriminatorLiteral) &&
      discriminatorLiteral.value === discriminatorValue
    )
  })
  if (!unionSchema) {
    return {
      status: 'fail',
      errors: [
        {
          code: 'INVALID_DISCRIMINATED_UNION',
          path: [],
          message: `Input is not valid as the discriminated union type ${schema.discriminator}="${discriminatorValue}"`,
        },
      ],
    }
  }
  const result = safeParse(unionSchema, input)
  if (result.status === 'ok') {
    return result
  }
  return {
    status: 'fail',
    errors: [
      {
        code: 'INVALID_DISCRIMINATED_UNION',
        path: [],
        message: `Input is not valid as the discriminated union type ${schema.discriminator}="${discriminatorValue}"`,
      },
      ...result.errors,
    ],
  }
}

type PlainObject = {[key: string]: unknown}
const isPlainObject = (value: unknown): value is {[key: string]: unknown} => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
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
  const keys: string[] = Object.keys(schema.shape)

  if (!isPlainObject(input)) {
    return {
      status: 'fail',
      errors: [
        {
          path: [],
          code: 'INVALID_TYPE',
          message: `Expected an object with keys {${keys.join(
            ', ',
          )}} but got "${inspect(input)}"`,
        },
      ],
    }
  }
  const errors: ParseErrorDetails[] = []
  const value: PlainObject = {}
  keys.forEach(key => {
    const parsed = safeParse(schema.shape[key]!, input[key])
    if (parsed.status === 'fail') {
      errors.push(
        ...parsed.errors.map(err => ({
          ...err,
          path: [key, ...err.path],
        })),
      )
    } else if (parsed.value !== undefined) {
      value[key] = parsed.value
    }
  })
  if (errors.length > 0) {
    return {status: 'fail', errors}
  }
  return {status: 'ok', value}
}

function isKeyedObject(value: unknown): value is {_key: string} {
  return isPlainObject(value) && typeof value._key === 'string'
}

export function parseObjectArray<S extends SanityObjectArray>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  if (!Array.isArray(input)) {
    return {
      status: 'fail',
      errors: [
        {
          path: [],
          code: 'INVALID_TYPE',
          message: `Expected an array but got "${inspect(typeof input)}"`,
        },
      ],
    }
  }

  const errors: ParseErrorDetails[] = []
  const value = (input as unknown[]).map((item, index) => {
    if (!isKeyedObject(item)) {
      errors.push({
        code: 'ARRAY_ELEMENT_NOT_KEYED_OBJECT',
        path: [index],
        message: 'Expected an object with a "_key" property',
      })
      return
    }
    const parsed = safeParse(schema.element, item)
    if (parsed.status === 'fail') {
      errors.push(
        ...parsed.errors.map(err => ({
          ...err,
          path: [item._key, ...err.path],
        })),
      )
      return undefined
    }
    return parsed.value
  }) as {_key: string}[]

  if (errors.length > 0) {
    return {status: 'fail', errors}
  }
  return {status: 'ok', value}
}

export function parsePrimitiveArray<S extends SanityPrimitiveArray>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  if (!Array.isArray(input)) {
    return {
      status: 'fail',
      errors: [
        {
          path: [],
          code: 'INVALID_TYPE',
          message: `Expected an array but got "${inspect(typeof input)}"`,
        },
      ],
    }
  }

  const errors: ParseErrorDetails[] = []
  const value = (input as unknown[]).map((item, index) => {
    const parsed = safeParse(schema.element, item)
    if (parsed.status === 'fail') {
      errors.push(
        ...parsed.errors.map(err => ({
          ...err,
          path: [index, ...err.path],
        })),
      )
    } else {
      return parsed.value
    }
    throw new Error("Parse result is neither 'fail' nor 'ok'")
  }) as any[]

  if (errors.length > 0) {
    return {status: 'fail', errors}
  }
  return {status: 'ok', value}
}
