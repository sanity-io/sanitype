import React, {useCallback, useEffect, useState} from 'react'
import {Card, Code, Stack} from '@sanity/ui'
import {tap} from 'rxjs'
import {createIfNotExists, patch} from '@bjoerge/mutiny'
import {isObjectSchema, isStringSchema} from '../../src/asserters'
import {DocumentInput, ObjectInput, StringInput} from './lib/form'
import {person} from './schema/person'
import {personForm} from './forms/person'
import {createStore} from './lib/mock-store'
import type {InputProps, PatchEvent} from './lib/form'
import type {ComponentType} from 'react'
import type {Infer, SanityAny, SanityType} from 'sanitype'

function Unresolved<Schema extends SanityAny>(props: InputProps<Schema>) {
  return <div>Unresolved input for type {props.schema.typeName}</div>
}

function resolveInput<Schema extends SanityType>(
  schema: Schema,
): ComponentType<InputProps<Schema>> {
  if (isStringSchema(schema)) {
    return StringInput as any
  }
  if (isObjectSchema(schema)) {
    return ObjectInput as any
  }
  return Unresolved
}

const documentId = 'dummy'
type Person = Infer<typeof person>
const datastore = createStore<Person>([
  {
    _id: 'dummy',
    _type: 'person',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: '0',
    address: {
      country: 'Norway',
      street: 'Næss',
      city: 'Oslo',
    },
    name: 'Bjørge',
  },
])

function App() {
  const [value, setValue] = useState<Partial<Person>>(datastore.get('dummy'))

  useEffect(() => {
    const sub = datastore
      .listen(documentId)
      .pipe(tap(doc => setValue(doc)))
      .subscribe()
    return () => {
      sub.unsubscribe()
    }
  }, [])

  const handlePatch = useCallback((event: PatchEvent) => {
    datastore.apply([
      createIfNotExists({_id: documentId, _type: person.shape._type.value}),
      patch(documentId, event.patches),
    ])
  }, [])

  return (
    <Card height="fill" padding={2}>
      <Stack space={6} padding={3}>
        <DocumentInput
          value={value}
          schema={person}
          form={personForm}
          onPatch={handlePatch}
          resolveInput={resolveInput}
        />
        {value && (
          <Card padding={4} shadow={2} radius={2}>
            <Code language="json">{JSON.stringify(value, null, 2)}</Code>
          </Card>
        )}
      </Stack>
    </Card>
  )
}

export default App
