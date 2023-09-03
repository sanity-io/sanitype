// function defineForm(schema: SanityObjectType<T>) {}

type LegacyField<Name extends string> = {
  name: Name
}

type LegacyObjectForm<
  Name extends string,
  Fields extends LegacyField<any>[],
> = {
  name: Name
  fields: Fields
}

type Test = LegacyObjectForm<'person', [LegacyField<'foo'>, LegacyField<'bar'>]>

// export const packageExports: LegacyObjectForm<'person', > = {
//   name: 'person',
//   title: 'Person',
//   type: 'document',
//   fields: [{name: 'name', type: 'string'}],
// }
