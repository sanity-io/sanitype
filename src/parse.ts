import {Infer, SanityType} from "./defs"

export function parse<T extends SanityType>(
  schema: T,
  input: unknown,
): Infer<T> {
  return {} as Infer<T>
}
