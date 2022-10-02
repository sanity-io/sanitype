import {Infer, TypeDef} from "./defs"

export declare function parse<T extends TypeDef<any>>(
  schema: T,
  input: unknown,
): Infer<T>
