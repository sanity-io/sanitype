import {INTERNAL_REF_TYPE_SCHEMA} from './defs'
import {
  isBooleanSchema,
  isDateSchema,
  isDateTimeSchema,
  isDocumentSchema,
  isExtendableObjectSchema,
  isLiteralSchema,
  isNumberSchema,
  isObjectArraySchema,
  isObjectUnionSchema,
  isOptionalSchema,
  isPrimitiveArraySchema,
  isPrimitiveUnionSchema,
  isReferenceSchema,
  isStringSchema,
} from './asserters'
import {defineNonEnumerableGetter} from './helpers/defineNonEnumerableGetter'
import {referenceBase} from './shapeDefs'
import {getLazySchema} from './helpers/getLazySchema'
import {inspect} from './helpers/inspect'
import {
  isStrictlyDateTime,
  isStrictlyFormatted,
} from './helpers/strictDateParse'
import type {
  Infer,
  OutputOf,
  SanityAsset,
  SanityBlock,
  SanityBoolean,
  SanityDate,
  SanityDateTime,
  SanityDocument,
  SanityExtendableObject,
  SanityLiteral,
  SanityNumber,
  SanityObjectArray,
  SanityObjectUnion,
  SanityOptional,
  SanityPrimitiveArray,
  SanityPrimitiveUnion,
  SanityReference,
  SanityString,
  SanityType,
  SanityTypedObject,
} from './defs'
export type Path = Array<string | number | {_key: string}>

export type ErrorCode =
  | 'INVALID_TYPE'
  | 'INVALID_PRIMITIVE_UNION'
  | 'INVALID_OBJECT_UNION'
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
  if (isDateTimeSchema(schema)) {
    return parseDateTime(schema, input) as any
  }
  if (isDateSchema(schema)) {
    return parseDate(schema, input) as any
  }
  if (isReferenceSchema(schema)) {
    return parseReference(schema, input) as any
  }
  if (isExtendableObjectSchema(schema)) {
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
  if (isObjectUnionSchema(schema)) {
    return parseUnion(schema, input) as any
  }
  if (isPrimitiveUnionSchema(schema)) {
    return parsePrimitiveUnion(schema, input) as any
  }

  return {
    status: 'fail',
    errors: [
      {
        path: [],
        code: 'INVALID_TYPE',
        message: `Invalid input: ${inspect(input)}. Parsing of schema type "${
          schema.typeName
        }" is not supported.`,
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

// see https://es5.github.io/#x15.9.1.15
const ISO_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.sssZ'
export function parseDateTime(
  schema: SanityDateTime,
  input: unknown,
): ParseResult<string> {
  if (typeof input !== 'string') {
    return {
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
  if (!isStrictlyDateTime(input)) {
    return {
      status: 'fail',
      errors: [
        {
          path: [],
          code: 'INVALID_TYPE',
          message: `Expected a dateTime string on the format "${ISO_DATETIME_FORMAT}" but got "${inspect(
            input,
          )}"`,
        },
      ],
    }
  }
  return {status: 'ok', value: input}
}

const DATE_FORMAT = 'yyyy-mm-dd'
export function parseDate(
  schema: SanityDate,
  input: unknown,
): ParseResult<string> {
  if (typeof input !== 'string') {
    return {
      status: 'fail',
      errors: [
        {
          path: [],
          code: 'INVALID_TYPE',
          message: `Expected a date string on the format "${DATE_FORMAT}" but got "${inspect(
            input,
          )}"`,
        },
      ],
    }
  }

  if (!isStrictlyFormatted(input, DATE_FORMAT)) {
    return {
      status: 'fail',
      errors: [
        {
          path: [],
          code: 'INVALID_TYPE',
          message: `Expected a date string on the format "${DATE_FORMAT.toUpperCase()}" but got "${inspect(
            input,
          )}"`,
        },
      ],
    }
  }
  return {status: 'ok', value: input}
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

export function parsePrimitiveUnion<S extends SanityPrimitiveUnion>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  const errors: ParseErrorDetails[] = []
  for (const unionTypeDef of schema.union) {
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
        code: 'INVALID_PRIMITIVE_UNION',
        path: [],
        message: "Input doesn't match any of the valid union types",
      },
      ...errors,
    ],
  }
}

function findUnionSchemaForType(
  unionSchema: SanityObjectUnion,
  typeName: string,
):
  | SanityTypedObject
  | SanityObjectUnion
  | SanityReference
  | SanityBlock
  | SanityAsset
  | undefined {
  return unionSchema.union.find(
    (
      objectDef:
        | SanityTypedObject
        | SanityObjectUnion
        | SanityReference
        | SanityBlock
        | SanityAsset,
    ) => {
      if (isObjectUnionSchema(objectDef)) {
        return findUnionSchemaForType(objectDef, typeName)
      }
      const typeLiteral = objectDef.shape._type
      return isLiteralSchema(typeLiteral) && typeLiteral.value === typeName
    },
  )
}

function hasTypeField(input: any): input is {_type: string} {
  return '_type' in input
}
export function parseUnion<S extends SanityObjectUnion>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  if (!isPlainObject(input) || !hasTypeField(input)) {
    return {
      status: 'fail',
      errors: [
        {
          code: 'INVALID_OBJECT_UNION',
          path: [],
          message: `Input must be an object with a "_type"-property`,
        },
      ],
    }
  }
  const unionSchema = input._type && findUnionSchemaForType(schema, input._type)
  if (!unionSchema) {
    return {
      status: 'fail',
      errors: [
        {
          code: 'INVALID_OBJECT_UNION',
          path: [],
          message: `Type "${input._type}" not found among valid union types`,
        },
      ],
    }
  }
  const result = safeParse(unionSchema, input)
  if (result.status === 'ok') {
    return result as any
  }
  return {
    status: 'fail',
    errors: [
      {
        code: 'INVALID_OBJECT_UNION',
        path: [],
        message: `Cannot parse input as union type "${input._type}"`,
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

export function parseObject<S extends SanityExtendableObject>(
  schema: S,
  input: unknown,
): ParseResult<OutputOf<S>> {
  // This isn't strictly correct: there may be additional keys present, however,
  // other approaches break type inference for objects that have both known
  // and unknown keys (such as assets).
  //
  // https://github.com/microsoft/TypeScript/issues/52931
  const keys = Object.keys(schema.shape) as (keyof typeof schema.shape)[]

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
