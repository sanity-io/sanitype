# sani***ty***pe

------

# Experimental TypeScript-first schemas for Sanity

Runtime validation & static type inference

## Features:

### Developer friendly API

You define schemas using TypeScript, which gives you the full benefit of static type checking.

### Extensible

Create base types that can be extended in different contexts.

### End to end type safety with runtime validation

You can use sanitype definitions to validate JSON data coming from the Sanity API or other external data sources

### Immutable API

Extending a type returns a new modified instance and never modifies the original one

### Limitations

Static types only works schema generation works as far as TypeScript can infer

For example, if you desire to generate types dynamically like this:

```typescript
const strings = ["firstName", "lastName"]
const shape = {}
strings.forEach(key => {
  shape[key] = z.string()
})

const schema = s.object(shape)

// type of value will be {}
const value = schema.parse({
  firstName: "Bjørge",
  lastName: "Næss"
})

```

The inferred static type here will be limited to `{}` (note: the parser will still work as expected)

To reap the full benefit of static typing, it's recommended to write your schemas in a way that TypeScript can infer as narrow types as possible, e.g.:

```typescript
const shape = {
  firstName: z.string(),
  lastName: z.string(),
}
const schema = s.object(shape)

// inferred type of value will be {firstName: string, lastName: string}
const value = schema.parse({
  firstName: "Bjørge",
  lastName: "Næss"
})


```

# Todo
- **Error formatters**:
  - Terminal (w/colors)
  - React
  - Plain HTML(?)
- **Form specs**
  - Like today's sanity schema but without types
- **Serializers/Deserializers**
  - JSON <=> TypeScript
- **Validation**
    - W/custom error messages


### Acknowledgements

Heavily inspired by zod
