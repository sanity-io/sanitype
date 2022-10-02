import {
  DocumentTypeDef,
  ObjectTypeDef,
  StripInternalRefType,
  TypeDef,
} from "./defs"

interface Document {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  [field: string]: unknown
}

export declare function expand<
  T extends {
    _type: "reference"
    _ref?: string
    readonly __internal_refTypeDef?: RefTypeDef
  },
  RefTypeDef extends DocumentTypeDef<any>,
>(
  reference: T,
): T["__internal_refTypeDef"] extends TypeDef<any, infer Output>
  ? Promise<StripInternalRefType<Output>>
  : T extends {_weak: true}
  ? undefined | Document
  : Document
