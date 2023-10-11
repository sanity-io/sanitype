import React, {useCallback, useEffect, useState} from 'react'
import {Card, Flex, Text} from '@sanity/ui'
import {tap} from 'rxjs'
import {createIfNotExists, patch} from '@bjoerge/mutiny'
import {
  isBooleanSchema,
  isObjectSchema,
  isObjectUnionSchema,
  isOptionalSchema,
  isPrimitiveUnionSchema,
  isStringSchema,
} from 'sanitype'
import {
  BooleanInput,
  DocumentInput,
  ObjectInput,
  StringInput,
  UnionInput,
} from './lib/form'
import {person} from './schema/person'
import {personForm} from './forms/person'
import {createStore} from './lib/mock-store'
import {JSONValue} from './lib/form/JsonView'
import {PrimitiveUnionInput} from './lib/form/inputs/PrimitiveUnionInput'
import type {InputProps, PatchEvent} from './lib/form'
import type {Infer, SanityAny, SanityOptional, SanityType} from 'sanitype'
import type {ComponentType} from 'react'

function Unresolved<Schema extends SanityAny>(props: InputProps<Schema>) {
  return <Text>Unresolved input for type {props.schema.typeName}</Text>
}

function OptionalInput<Schema extends SanityOptional<SanityAny>>(
  props: InputProps<Schema>,
) {
  const Input = props.resolveInput(props.schema.type)

  return <Input {...props} schema={props.schema.type} />
}

function resolveInput<Schema extends SanityType>(
  schema: Schema,
): ComponentType<InputProps<Schema>> {
  if (isStringSchema(schema)) {
    return StringInput as any
  }
  if (isOptionalSchema(schema)) {
    return OptionalInput as any
  }
  if (isObjectSchema(schema)) {
    return ObjectInput as any
  }
  if (isObjectUnionSchema(schema)) {
    return UnionInput as any
  }
  if (isPrimitiveUnionSchema(schema)) {
    return PrimitiveUnionInput as any
  }
  if (isBooleanSchema(schema)) {
    return BooleanInput as any
  }
  return Unresolved
}

const documentId = 'example'
type Person = Infer<typeof person>
const datastore = createStore<Person>([
  {
    _id: documentId,
    _type: 'person',
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: '0',
    address: {
      country: 'Norway',
      street: 'Næss',
      city: 'Oslo',
    },
    favoritePet: {_type: 'canine', name: 'Jara', barks: false},
    name: 'Bjørge',
  },
])

function App() {
  const [value, setValue] = useState<Partial<Person>>(datastore.get(documentId))

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
    <Card width="fill" height="fill" padding={2}>
      <Flex size={2} gap={2} padding={3}>
        <Card flex={1} width={3} padding={4} shadow={2} radius={2}>
          <DocumentInput
            value={value}
            schema={person}
            form={personForm}
            onPatch={handlePatch}
            resolveInput={resolveInput}
          />
        </Card>
        {value && (
          <Card flex={1} padding={4} shadow={2} radius={2}>
            <JSONValue value={value} />
          </Card>
        )}
      </Flex>
    </Card>
  )
}

export default App
