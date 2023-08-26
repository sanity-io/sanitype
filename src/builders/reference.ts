import {referenceBase} from '../shapeDefs'
import {Builder} from './builder'
import type {SanityDocumentValue} from '../shapeDefs'
import type {SanityReference, SanityType, WithRefTypeDef} from '../defs'

export class ReferenceBuilder<
    RefType extends SanityType<SanityDocumentValue>,
    Output extends WithRefTypeDef<RefType> = WithRefTypeDef<RefType>,
  >
  extends Builder<Output>
  implements SanityReference<RefType>
{
  typeName = 'reference' as const
  shape = referenceBase.shape

  constructor(public referenceType: RefType) {
    super()
  }
  get output(): Output {
    throw new Error('This method is not defined runtime')
  }
}

export function reference<RefType extends SanityType<SanityDocumentValue>>(
  to: RefType,
) {
  return new ReferenceBuilder(to)
}
