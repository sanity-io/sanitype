import {Conceal, SanityDocument, SanityType} from "./defs"

interface DocumentLike {
  _type: string
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  [field: string]: unknown
}

interface ReferenceLike {
  _type: "reference"
  _ref?: string
  _weak?: boolean
}

export declare function expand<
  T extends ReferenceLike | (ReferenceLike & Conceal<RefTypeDef>),
  RefTypeDef extends SanityDocument,
>(
  reference: T,
): T extends Conceal<infer RefTypeDef>
  ? RefTypeDef extends SanityType<infer Output>
    ? Promise<Output>
    : T extends {_weak: true}
    ? Promise<undefined | DocumentLike>
    : Promise<DocumentLike>
  : Promise<DocumentLike>
