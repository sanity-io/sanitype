import {
  OutputOf,
  SanityAny,
  SanityLazy,
  SanityLiteral,
  SanityNumber,
  SanityString,
} from "../defs.js"
import {Builder} from "./builder.js"

class LazyBuilder<T extends SanityAny>
  extends Builder<() => T, OutputOf<T>>
  implements SanityLazy<T>
{
  typeName = "lazy" as const
}

export function lazy<T extends SanityAny>(creator: () => T) {
  return new LazyBuilder<T>(creator)
}
