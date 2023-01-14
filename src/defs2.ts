import {Infer} from "./defs"

interface SanityType<Output = any, Def = any> {
  typeName: string
  def: Def
  output: Output
}

type SanityAny = SanityType<any, any>
type SanityString = SanityType<string, string>

export interface SanityLiteral<
  Def extends boolean | string | number = boolean | string | number,
> extends SanityType<Def, Def> {
  typeName: "literal"
}

type SanityObjectShape<T = any> = {[key in keyof T]: SanityAny}

type OutputFormatFix = {}

export type OutputFromShape<T extends SanityObjectShape> = {
  [key in keyof T]: Infer<T[key]>
} & OutputFormatFix

interface SanityObject<
  Def extends SanityObjectShape = SanityObjectShape,
  Output = OutputFromShape<Def>,
> extends SanityType<Output, Def> {}
export type OutputOf<T extends SanityType> = T["output"]

interface SanityLazy<T extends SanityType> extends SanityType<OutputOf<T>> {
  typeName: "lazy"
}

type Obj = SanityType<{foo: string}>

declare const obj: Obj
declare const output: OutputOf<typeof obj>

const throwOnOutputAccess = {
  get output(): any {
    throw new Error("This method is not defined runtime")
  },
}

export function object<T extends SanityObjectShape>(shape: T): SanityObject<T> {
  return {
    typeName: "object",
    def: shape,
    ...throwOnOutputAccess,
  }
}

export function string(): SanityString {
  return {
    typeName: "string",
    def: "",
    ...throwOnOutputAccess,
  }
}

export function literal<Def extends boolean | number | string>(
  literal: Def,
): SanityLiteral<Def> {
  return {
    typeName: "literal",
    def: literal,
    ...throwOnOutputAccess,
  }
}
const test: SanityObject<{foo: SanityString}> = object({foo: string()})

//--------lazy
function lazy<T extends SanityAny>(creator: () => T): SanityLazy<T> {
  return {
    typeName: "lazy",
    def: creator,
    ...throwOnOutputAccess,
  }
}

type Result = SanityType<{foo: string}>
type LazyDef = SanityLazy<SanityObject<{foo: SanityString}>>

declare const def: LazyDef
const r: Result = def

interface Person {
  _type: "person"
  name: string
  parent: Person
}

const lazyPerson: SanityType<Person> = lazy(() =>
  object({
    _type: literal("person"),
    name: lazy(() => string()),
    parent: lazy(() => lazyPerson),
  }),
)

declare const person: OutputOf<typeof lazyPerson>
