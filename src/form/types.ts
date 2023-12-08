import type {
  Infer,
  SanityAny,
  SanityArray,
  SanityAsset,
  SanityBlock,
  SanityBoolean,
  SanityDocument,
  SanityLiteral,
  SanityObject,
  SanityObjectArray,
  SanityObjectLike,
  SanityObjectUnion,
  SanityOptional,
  SanityPrimitive,
  SanityPrimitiveArray,
  SanityPrimitiveUnion,
  SanityReference,
  SanityString,
  SanityType,
  SanityTypedObject,
} from '../defs'

export type CommonFieldOptions = {
  readonly?: boolean
  title?: string
  form?: SanityFormDef<SanityAny>
}
export type StringFieldOptions = CommonFieldOptions
export type BooleanFieldOptions = CommonFieldOptions
export type LiteralFieldOptions = CommonFieldOptions
export type FieldsetsDef = Todo

export type ObjectFieldOptions<T extends SanityObject> = CommonFieldOptions & {
  form: ObjectFormDef<T>
}

export type ObjectUnionFieldOptions<
  T extends SanityTypedObject | SanityReference | SanityBlock | SanityAsset,
> = CommonFieldOptions & {
  form: ObjectUnionFormDef<T>
}

export type PrimitiveUnionFieldOptions<
  T extends SanityPrimitive | SanityLiteral,
> = CommonFieldOptions & {
  form: PrimitiveUnionFormDef<T>
}

export type ArrayFieldOptions<T extends SanityArray<any>> =
  CommonFieldOptions & {
    form: ArrayFormDef<T>
  }

export type OptionalFieldOptions<T extends SanityOptional<any>> =
  T extends SanityOptional<infer FieldType> ? FieldOptions<FieldType> : never

export type FieldOptions<T extends SanityType> = T extends SanityObject
  ? ObjectFieldOptions<T>
  : T extends SanityArray<any>
    ? ArrayFieldOptions<T>
    : T extends SanityString
      ? StringFieldOptions
      : T extends SanityLiteral
        ? LiteralFieldOptions
        : T extends SanityBoolean
          ? BooleanFieldOptions
          : T extends SanityObjectUnion<infer UnionTypes>
            ? ObjectUnionFieldOptions<UnionTypes>
            : T extends SanityPrimitiveUnion<infer UnionTypes>
              ? PrimitiveUnionFieldOptions<UnionTypes>
              : T extends SanityOptional<any>
                ? OptionalFieldOptions<T>
                : SanityAny extends T
                  ? CommonFieldOptions
                  : ['TODO', T]

export type ItemOptions<T extends SanityType> = T extends SanityObject
  ? ObjectFieldOptions<T>
  : T extends SanityArray<any>
    ? ArrayFieldOptions<T>
    : T extends SanityString
      ? StringFieldOptions
      : unknown

export type SystemFields =
  | '_type'
  | '_id'
  | '_createdAt'
  | '_updatedAt'
  | '_rev'

export type FindTypeByName<
  Type extends SanityObjectLike | SanityObjectUnion,
  SearchName extends string,
> = Type extends SanityObjectUnion<infer S>
  ? S extends SanityObjectLike
    ? FindTypeByName<S, SearchName>
    : unknown
  : Type extends SanityObject<{_type: SanityLiteral<infer TName>}>
    ? SearchName extends TName
      ? Type
      : never
    : Type

export type UnpackShapes<Type extends SanityObjectLike | SanityObjectUnion> =
  Type extends SanityObjectUnion<infer O>
    ? O extends SanityObject
      ? UnpackShapes<O>
      : unknown
    : Type extends SanityObject<infer Shape>
      ? Shape
      : never

export type Union = SanityObjectUnion<
  | SanityObject<{_type: SanityLiteral<'foo'>}>
  | SanityObject<{_type: SanityLiteral<'bar'>}>
  | SanityObject<{_type: SanityLiteral<'object'>; anonymous: SanityBoolean}>
>
export type UnionArray = SanityObjectArray<Union>

export type ExtractArrayItemTypeNames<T extends SanityObjectArray> =
  UnpackShapes<T['element']>

export type Pluck<T, K extends keyof any> = K extends keyof T ? T[K] : never
export type GetType<T> = T extends SanityLiteral<infer Name>
  ? Name extends string
    ? Name
    : never
  : never

export type NamedTypeMap<T extends SanityObjectArray> =
  T extends SanityObjectArray<infer ItemType>
    ? ItemType extends SanityObjectLike | SanityObjectUnion
      ? ItemType
      : never
    : never

type Test<T extends SanityObjectArray> = T['element']

export type Simple = SanityObjectArray<
  SanityObject<{_type: SanityLiteral<'foo'>; fooProp: SanityString}>
>

export type ArrayItemTypeNames<T extends SanityObjectArray<any>> = GetType<
  Pluck<ExtractArrayItemTypeNames<T>, '_type'>
>

export type ArrayTypeMap<T extends SanityObjectArray> = {
  [Name in ArrayItemTypeNames<T>]: FindTypeByName<T['element'], Name>
}

export type TypeNames<T extends SanityTypedObject> = GetType<Pluck<T, '_type'>>

type Test1 = Infer<UnionArray['element']>
type Test3 = NamedTypeMap<Simple>
type Test4 = NamedTypeMap<UnionArray>
type SS1 = ArrayItemTypeNames<UnionArray>
type SS2 = ArrayTypeMap<UnionArray>

type SS3 = UnpackShapes<
  SanityObjectUnion<
    | SanityObject<{_type: SanityLiteral<'foo'>}>
    | SanityObject<{_type: SanityLiteral<'bar'>}>
    | SanityObject<{_type: SanityLiteral<'baz'>; anonymous: SanityBoolean}>
  >
>

export type ObjectArrayFormDef<TMap extends ArrayTypeMap<any>> = {
  draggable?: boolean
  items: {
    [TypeName in keyof TMap]: TMap[TypeName] extends SanityType
      ? ItemOptions<TMap[TypeName]>
      : never
  }
}

export type UnionTypeOptions<T extends SanityType> = T extends SanityObject
  ? ObjectFieldOptions<T>
  : unknown

export type PrimitiveUnionTypeOptions<T extends SanityLiteral> =
  T extends SanityLiteral ? FieldOptions<T> : unknown

export type ObjectUnionFormDef<
  T extends SanityTypedObject | SanityReference | SanityBlock | SanityAsset,
> = {
  types: {
    [Name in GetType<T['shape']['_type']>]: UnionTypeOptions<
      FindTypeByName<T, Name>
    >
  }
}

export type PrimitiveUnionFormDef<T extends SanityPrimitive | SanityLiteral> =
  T extends SanityLiteral
    ? {
        types: {
          [Name in GetType<T>]: PrimitiveUnionTypeOptions<SanityLiteral<Name>>
        }
      }
    : {
        types: ['TODO']
      }

export type PrimitiveArrayFormDef<T extends SanityPrimitiveArray> = {
  draggable?: boolean
}

export type StringFormDef<T extends SanityString> = {
  multiline?: boolean
}

export type ArrayFormDef<T extends SanityArray<any>> =
  T extends SanityObjectArray
    ? ObjectArrayFormDef<ArrayTypeMap<T>>
    : T extends SanityPrimitiveArray
      ? PrimitiveArrayFormDef<T>
      : never

export type Todo = unknown

export type ObjectFormDef<T extends SanityObject> = {
  fieldsets?: FieldsetsDef
  fields: Omit<
    {[Key in keyof T['shape']]: FieldOptions<T['shape'][Key]>},
    SystemFields
  >
}

export type DocumentFormDef<T extends SanityDocument> = {
  liveEdit?: boolean
  fieldsets?: FieldsetsDef
  fields: Omit<
    {[k in keyof T['shape']]: FieldOptions<T['shape'][k]>},
    SystemFields
  >
}

export type SanityFormDef<T extends SanityType> = T extends SanityDocument
  ? DocumentFormDef<T>
  : T extends SanityObject
    ? ObjectFormDef<T>
    : T extends SanityObjectArray
      ? ObjectArrayFormDef<ArrayTypeMap<T>>
      : T extends SanityPrimitiveArray
        ? PrimitiveArrayFormDef<T>
        : T extends SanityString
          ? StringFormDef<T>
          : T extends SanityObjectUnion<infer U>
            ? ObjectUnionFormDef<U>
            : Todo
