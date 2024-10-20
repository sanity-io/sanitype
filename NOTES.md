
# Open questions

1. Should schema types allow for _some_ degree of metadata? E.g. feels like it should at least support a general `description`. Although, this metadata should probably be seen as more like metadata about the _content model_ itself, rather than something to guide the editor when doing content entry. Alternatively, metadata could be provided in the form of code comments/tsdocs, but that requires more effort to extract.
2. No builder pattern? Currently, this implementation uses creator functions that returns plain JavaScript values. This is design choice appears to be in line with general industry trends, but is different from e.g. zod, which uses a builder pattern. The advantage if builder pattern is that you can pass the schema type around, and start calling methods on it. With a creator pattern, you'll have to import the methods and call them by passing the schema type to it. E.g. builder pattern: `movie.parse(json)`, creator pattern: `parse(movie, json)`. Note: it should be fairly straightforward to implement an api providing the builder pattern on top of the creator functions if we want to.
3. Do we still need schema-level runtime checks for developers using plain JS? I think yes, also because TS errors can be hard to comprehend, so being able to validate the schema runtime and give helpful errors in a UI. Also: we probably want to warn about common pitfalls.