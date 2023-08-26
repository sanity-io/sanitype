import {INTERNAL_REF_TYPE_SCHEMA} from './defs'
import {ParseError, safeParse} from './parse'
import {documentBase} from './shapeDefs'
import type {Conceal, Infer, SanityType} from './defs'
import type {ParseOk, ParseResult} from './parse'
import type {referenceBase, SanityDocumentValue} from './shapeDefs'

export type DocumentLike = Infer<typeof documentBase>
export type ReferenceLike = Infer<typeof referenceBase>

export type ReferenceWithOptionalRefType<RefTypeDef> = ReferenceLike &
  Partial<Conceal<RefTypeDef>>

const NO_REF: Promise<ParseOk<any>> = Promise.resolve({
  status: 'ok',
  value: undefined,
})
export function createSafeResolve(fetch: (ref: string) => Promise<any>) {
  return function safeResolve<
    T extends ReferenceWithOptionalRefType<RefTypeDef>,
    RefTypeDef extends SanityType<SanityDocumentValue>,
  >(
    reference: T,
  ): Promise<
    ParseResult<
      T extends Conceal<infer RefTypeDef>
        ? RefTypeDef extends SanityType<infer Output>
          ? Output
          : T extends {_weak: true}
          ? undefined | DocumentLike
          : DocumentLike
        : DocumentLike
    >
  > {
    if (!reference._ref) {
      return NO_REF
    }

    return fetch(reference._ref).then(input =>
      safeParse(reference[INTERNAL_REF_TYPE_SCHEMA] || documentBase, input),
    ) as any
  }
}

export function createResolve(fetch: (ref: string) => Promise<any>) {
  const safeResolve = createSafeResolve(fetch)

  return function resolve<
    T extends ReferenceWithOptionalRefType<RefTypeDef>,
    RefTypeDef extends SanityType<SanityDocumentValue>,
  >(reference: T) {
    return safeResolve(reference).then(result =>
      result.status === 'ok'
        ? result.value
        : Promise.reject(new ParseError(result.errors)),
    )
  }
}

export const resolve = createResolve(() =>
  Promise.reject(
    new Error('This is a stubbed `resolve` for demo purposes only'),
  ),
)
