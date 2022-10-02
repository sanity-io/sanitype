import {DocumentTypeDef, Internal, TypeDef} from "./defs"

interface DocumentLike {
  _type: string
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  [attribute: string]: unknown
}

interface ReferenceLike {
  _type: "reference"
  _ref?: string
  _weak?: boolean
}

export declare function expand<
  T extends ReferenceLike | (ReferenceLike & Internal<RefTypeDef>),
  RefTypeDef extends DocumentTypeDef<any>,
>(
  reference: T,
): T extends Internal<infer RefTypeDef>
  ? RefTypeDef extends TypeDef<any, infer Output>
    ? Promise<Output>
    : T extends {_weak: true}
    ? Promise<undefined | DocumentLike>
    : Promise<DocumentLike>
  : Promise<DocumentLike>
