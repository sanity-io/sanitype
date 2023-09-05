import type {SanityDocument, SanityFormDef} from 'sanitype'

export function autogenerate<T extends SanityDocument>(
  type: T,
): SanityFormDef<T> {
  return {} as any
}
