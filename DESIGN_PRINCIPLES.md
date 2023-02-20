- Immutable
- Favor composition over inheritance
- Minimal
- Structural typing everywhere
- JSON only. Use zod for advanced parsing
- Sanityisms built-in
  - Arrays can't have arrays
  - Array of primitive values can't be mixed with array of object values
  - Objects inside arrays get assigned `_key`-s
  - `_type`-annotations
  - No `record`-types
  - No `null`-types

### Immutable

### Explicit composition over inheritance/extending

Instead of `baseType.extend({extra: string()})` which only has the capacity add fields at the end of the type, zschema only supports
explicit composition, meaning the above example has to be composed explicitly from the type records

```js
const baseFields = {name: string(), other: string()}
const baseType = object(baseFields)

const extendedType = object({...baseFields, extra: string()})
```

This makes composition very clear and explicit, enables a predictable order (and customizable!) order of keys.

Want to shot the extra field at the top? No problem:

```
const extendedType = object({extra: string(), ...baseFields})
```

Want to include all base fields but the `other` field? Sure.

```
const extendedType = object({extra: string(), ...omit(baseFields, 'other')})
```

Want to pick just the name field from `baseFields`?

```
const extendedType = object({name: baseFields.name, extra: string()})
```
