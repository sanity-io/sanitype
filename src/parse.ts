import {Infer, SanityType} from "./defs"

export declare function parse<T extends SanityType>(
  schema: T,
  input: unknown,
): Infer<T>
