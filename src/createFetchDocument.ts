import {SanityType} from "./defs.js"
import {ParseError, safeParse} from "./parse.js"
import {SanityDocumentValue} from "./valueTypes.js"

export function createSafeFetchDocument(fetch: (id: string) => Promise<any>) {
  return function safeFetchDocument<
    DocumentSchema extends SanityType<SanityDocumentValue>,
  >(id: string, schema: DocumentSchema) {
    return fetch(id).then(input => safeParse(schema, input))
  }
}

export function createFetchDocument(fetch: (id: string) => Promise<any>) {
  const safeFetchDocument = createSafeFetchDocument(fetch)

  return function fetchDocument<
    DocumentSchema extends SanityType<SanityDocumentValue>,
  >(id: string, schema: DocumentSchema) {
    return safeFetchDocument(id, schema).then(result =>
      result.status === "ok"
        ? result.value
        : Promise.reject(new ParseError(result.errors)),
    )
  }
}

export const fetchDocument = createFetchDocument(() =>
  Promise.reject(
    new Error("This is a stubbed `fetchDocument` for demo purposes only"),
  ),
)