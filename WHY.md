## Why?

### Improved content migration DX

Sanitype schemas are highly composable. I.e. you can create a base schema that can be extended in different contexts or represent different versions of the same content model. This makes it easier to create a migration strategy that can be applied to different versions of the same schema. Different versions of a schema type can coexist side by side in a transition period, enabling incremental content migration.

### Shared content models

Current sanity schemas have a few drawbacks that makes it harder to share across runtimes and environments:

- They include both content model concerns and form/UI concerns, this means they assume browser context and will often fail if used server side
- They don't compose well, so you can't easily create a base schema that can be extended in different contexts
- They usually include a lot of boilerplate, which makes them harder to read and maintain

Decoupling UI/form concerns from the content model has several advantages:

- Easier re-use across runtimes and environments
- Content models can be easier shared between applications
- Content models can be composed and modified in a more flexible way, e.g.:
  - Different versions of the same content model can live side by side, extending or composing from each other
  - The content model can be published to npm versioned independently, imported as a dependency to another studio
- Importing external content into sanity in a way that guarantees that the shape of the imported content matches the shape of the schema
- Improved content migration DX.

Also make sure to take a look at the various tests that are co-located with the source code.

### Why not just use Zod?

There's several advantages of building our own:

#### We can build sanity-isms into it

Sanity is opinionated about a great deal of your content model, for example

1. Object types automatically gets assigned `_key: string` when they're inside arrays
2. Documents gets assigned a `_rev: string`-property, etc.
3. We can create mappings between various lifecycles of a sanity document (e.g. `const myDraft = asDraft(myDocumentSchema)`):
   1. Draft documents are deeply partial, so each property everywhere must be optional.
   2. Published documents will have better guarantees, so you don't need to null check required properties at all

##### Restrictions

Maybe more important is the _restrictions_ we can build into it

1. Zod has a lot of content types we don't support/care about, like sets, maps, functions, promises etc.
2. We don't support multidimensional arrays, arrays of both primitive values and objects.
3. Object unions is only supported for _typed_ objects (i.e. objects with a `_type` literal). This restriction is necessary in order to support collaborative real-time editing of partial object values. Without a discriminator it would be impossible to tell which schema type a partial (e.g. empty) object belongs to.
4. Fields starting with underscore is reserved for system fields. Sanitype produces a compile-time error if you define a field starting with underscore.
5. There's restrictions on what characters can be used as object properties
6. … and more?

Making our own lets us codify these rules into our schema model and provide developers with compile-time feedback if they try to model something we don't currently support!
