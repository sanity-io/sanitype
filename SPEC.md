- Fields can be either one of:
  - string, number, boolean, object (typed or untyped), array
  - a union of: string, number, boolean, typed object

- Arrays can be of either: 
  - an untyped object
  - a union of string, number, boolean values
  - a union of typed objects


Not supported:

- union of untyped objects
- union of arrays
- arrays where element type is:
  - another array
  - union of a primitive type and an object type (typed or untyped doesn't matter)
  - union of untyped objects
- 
- objects where a field type is:
    - union of untyped objects


1). A typed object is an object type with a `_type` literal defined. 