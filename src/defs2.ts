import {lazy, literal, object, string} from "./factories2"
import {Combine} from "./utils"

export interface SanityType<Output = any, Def = any> {
  typeName: string
  def: Def
  output: Output
}

export type SanityAny = SanityType<any, any>
export type SanityString = SanityType<string, string>
export type SanityNumber = SanityType<number, number>
export type SanityBoolean = SanityType<boolean, boolean>

export type SanityPrimitive = SanityString | SanityNumber | SanityBoolean
export interface SanityLiteral<
  Def extends boolean | string | number = boolean | string | number,
> extends SanityType<Def, Def> {
  typeName: "literal"
}

export interface SanityUnion<Def extends SanityAny, Output = OutputOf<Def>>
  extends SanityType<Output, Def[]> {
  typeName: "union"
}

export type SanityObjectShape<T = any> = {[key in keyof T]: SanityAny}

export interface SanityObject<
  Def extends SanityObjectShape = SanityObjectShape,
  Output = OutputFromShape<Def>,
> extends SanityType<Output, Def> {}

export interface SanityLazy<T extends SanityType>
  extends SanityType<OutputOf<T>> {
  typeName: "lazy"
}

type OutputFormatFix = {}
export type OutputFromShape<T extends SanityObjectShape> = {
  [key in keyof T]: Infer<T[key]>
} & OutputFormatFix

type AddArrayKey<T> = Combine<T, {_key: string}>

export interface SanityObjectArray<
  ElementType extends SanityObject | SanityUnion<SanityObject> =
    | SanityObject
    | SanityUnion<SanityObject>,
  Output = AddArrayKey<OutputOf<ElementType>>[],
> extends SanityType<Output, ElementType> {
  typeName: "objectArray"
}

export interface SanityPrimitiveArray<
  ElementType extends SanityPrimitive | SanityUnion<SanityPrimitive> =
    | SanityPrimitive
    | SanityUnion<SanityPrimitive>,
  Output = FlattenUnion<ElementType>[],
> extends SanityType<Output, ElementType> {
  typeName: "primitiveArray"
}

type FlattenUnion<T extends SanityAny> = OutputOf<T>

type Obj = SanityType<{foo: string}>

declare const obj: Obj
declare const output: OutputOf<typeof obj>

export type Infer<T extends any> = T extends SanityAny ? OutputOf<T> : T

export type OutputOf<T extends SanityAny> = T["output"]

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
