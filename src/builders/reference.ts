import {Conceal, ReferenceBase, SanityReference, SanityType,} from "../defs.js"
import {SanityDocumentValue} from "../valueTypes.js"
import {_object, boolean, literal, string} from "../__deprecated_factories.js"
import {Builder} from "./builder.js"
import {Combine} from "../utils.js"

const referenceShape = _object({
  _type: literal("reference"),
  _ref: string(),
  _weak: boolean(),
})

type WithRefTypeDef<RefType extends SanityType<SanityDocumentValue>> = Combine<
  ReferenceBase,
  Conceal<RefType>
>

export class ReferenceBuilder<
    RefType extends SanityType<SanityDocumentValue>,
    Output extends WithRefTypeDef<RefType> = WithRefTypeDef<RefType>,
  >
  extends Builder<RefType, Output>
  implements SanityReference<RefType>
{
  typeName = "reference" as const

  get output(): Output {
    throw new Error("This method is not defined runtime")
  }
}

export function reference<RefType extends SanityType<SanityDocumentValue>>(
  to: RefType,
) {
  return new ReferenceBuilder(to)
}
