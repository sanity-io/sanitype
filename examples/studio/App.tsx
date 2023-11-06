import React, {Fragment, useCallback, useEffect, useState} from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Text,
} from '@sanity/ui'
import {
  ReplaySubject,
  defer,
  filter,
  finalize,
  map,
  merge,
  mergeMap,
  share,
  shareReplay,
  tap,
  timer,
} from 'rxjs'
import styled from 'styled-components'
import {SanityEncoder, createIfNotExists, del} from '@bjoerge/mutiny'
import {
  draft,
  isBooleanSchema,
  isObjectSchema,
  isObjectUnionSchema,
  isOptionalSchema,
  isPrimitiveUnionSchema,
  isStringSchema,
} from 'sanitype'

import {createClient} from '@sanity/client'
import {nanoid} from 'nanoid'
import {
  BooleanInput,
  DocumentInput,
  ObjectInput,
  StringInput,
  UnionInput,
} from './lib/form'
import {person} from './schema/person'
import {personForm} from './forms/person'
import {createContentLakeStore} from './lib/cl-store'
import {PrimitiveUnionInput} from './lib/form/inputs/PrimitiveUnionInput'
import {FormatMutation} from './lib/mutiny-formatter/react'
import {JsonView} from './lib/json-view/JsonView'
import type {InputProps, MutationEvent} from './lib/form'
import type {
  MutationEvent as APIMutationEvent,
  ListenEvent,
} from '@sanity/client'
import type {Infer, SanityAny, SanityOptional, SanityType} from 'sanitype'
import type {Mutation, SanityDocumentBase} from '@bjoerge/mutiny'
import type {MonoTypeOperatorFunction, Observable} from 'rxjs'
import type {ComponentType} from 'react'
import type {
  ListenerSyncEvent,
  PendingTransaction,
  RemoteDocumentEvent,
  RemoteListenerEvent,
} from './lib/cl-store/types'

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

const personDraft = draft(person)
type PersonDraft = Infer<typeof personDraft>

const client = createClient({
  projectId: 'ppsg7ml5',
  dataset: 'test',
  apiVersion: '2023-10-27',
  useCdn: false,
  token:
    'skmpNY5aQsWt7nWrBjBMg6nK9VtEN5WSuHiaoMfpRSh201ALhbBsZN1r2Vl4AmxpTI8NrpsES2PYBpPvrJEL3QaRg7l8ILRKPwwvbStxmXqPq6SgjMUkHzfd5mIBUFzz3NwCYv92ISaNEFaXEoVRiH2tovzU91AHBEzoimzL7YGqRIops83e',
})
let _globalListener: {
  welcome$: Observable<any>
  mutations$: Observable<ListenEvent<any>>
} | null = null

function shareReplayDelayedDisconnect<T>(
  delay: number,
): MonoTypeOperatorFunction<T> {
  return share<T>({
    connector: () => new ReplaySubject(1, Infinity),
    resetOnError: true,
    resetOnComplete: true,
    resetOnRefCountZero: () => timer(delay),
  })
}

const getGlobalEvents = () => {
  if (!_globalListener) {
    const allEvents$ = defer(() =>
      client.listen(
        '*[!(_id in path("_.**"))]',
        {},
        {
          events: ['welcome', 'mutation'],
          includeResult: false,
          visibility: 'query',
          effectFormat: 'mendoza',
        },
      ),
    ).pipe(shareReplayDelayedDisconnect(1000))

    // This is a stream of welcome events from the server, each telling us that we have established listener connection
    // We map these to snapshot fetch/sync. It is good to wait for the first welcome event before fetching any snapshots as, we may miss
    // events that happens in the time period after initial fetch and before the listener is established.
    const welcome$ = allEvents$.pipe(
      filter((event: any) => event.type === 'welcome'),
      shareReplayDelayedDisconnect(1000),
    )

    const mutations$ = allEvents$.pipe(
      filter((event: any) => event.type === 'mutation'),
    )

    _globalListener = {
      welcome$,
      mutations$,
    }
  }

  return _globalListener
}

function listen(id: string) {
  const globalEvents = getGlobalEvents()
  return merge(
    globalEvents.welcome$.pipe(
      mergeMap(() => client.getDocument(id)),
      map(
        (doc: undefined | SanityDocumentBase): ListenerSyncEvent => ({
          type: 'sync',
          transactionId: doc?._id,
          document: doc,
        }),
      ),
    ),
    globalEvents.mutations$.pipe(
      filter(
        (event): event is APIMutationEvent =>
          event.type === 'mutation' && event.documentId === id,
      ),
      map(
        (event): RemoteListenerEvent => ({
          type: 'mutation',
          transactionId: event.transactionId,
          effects: event.effects!.apply,
        }),
      ),
    ),
  )
}

const datastore = createContentLakeStore({
  listen,
  sync: id => client.observable.getDocument(id),
  submit: transactions =>
    Promise.all(
      transactions.map(trans =>
        client.dataRequest(
          'mutate',
          {
            transactionId: trans.id,
            mutations: SanityEncoder.encode(trans.mutations),
          },
          {
            visibility: 'async',
            returnDocuments: false,
          },
        ),
      ),
    ),
})

const DOCUMENT_IDS = ['some-document', 'some-other-document']

function App() {
  const [documentId, setDocumentId] = useState<string>(DOCUMENT_IDS[0])
  const [local, setLocalValue] = useState<PersonDraft | null>(null)
  const [server, setServerValue] = useState<PersonDraft | null>(null)
  const [outbox, setOutbox] = useState<PendingTransaction[]>([])
  const [autoOptimize, setAutoOptimize] = useState<boolean>(true)
  const [remoteLogEntries, setRemoteLogEntries] = useState<
    RemoteDocumentEvent[]
  >([])

  useEffect(() => {
    const local$ = datastore.outbox.pipe(tap(next => setOutbox(next)))
    const remote$ = datastore.remoteLog.pipe(
      tap(event => setRemoteLogEntries(e => [...e, event].slice(0, 100))),
    )
    const sub = merge(local$, remote$).subscribe()
    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    const sub = datastore
      .get(documentId)
      .pipe(
        tap(event => {
          setLocalValue(event.local as PersonDraft)
          setServerValue(event.remote as PersonDraft)
        }),
      )
      .subscribe()
    return () => {
      sub.unsubscribe()
    }
  }, [documentId])

  const handleMutate = useCallback(
    (mutations: Mutation[]) => {
      datastore.mutate(mutations)
      if (autoOptimize) datastore.optimize()
    },
    [autoOptimize],
  )

  const handleMutation = useCallback(
    (event: MutationEvent) => {
      createIfNotExists({_id: documentId, _type: person.shape._type.value}),
        handleMutate([
          createIfNotExists({_id: documentId, _type: person.shape._type.value}),
          ...event.mutations,
        ])
    },
    [documentId, handleMutate],
  )

  const handleDelete = useCallback(() => {
    handleMutate([del(documentId)])
  }, [handleMutate, documentId])

  return (
    <Card width="fill" height="fill" padding={2}>
      <Stack space={3}>
        <Flex size={2} gap={2}>
          <Card flex={2} width={3} padding={3} shadow={2} radius={2}>
            <Stack space={3}>
              <TabList space={2}>
                {DOCUMENT_IDS.map(id => (
                  <Tab
                    key={id}
                    aria-controls={`tab-${id}-panel`}
                    id={`tab-${id}`}
                    label={id}
                    onClick={() => {
                      setDocumentId(id)
                    }}
                    selected={id === documentId}
                  />
                ))}
              </TabList>
              {DOCUMENT_IDS.map(id => (
                <TabPanel
                  key={id}
                  aria-labelledby={`tab-${id}-panel`}
                  hidden={id !== documentId}
                  id={`tab-${id}-panel`}
                >
                  <Card padding={3} shadow={1} radius={2}>
                    <Stack flex={1} space={3}>
                      <DocumentInput
                        value={
                          local || {
                            _id: nanoid(),
                            _type: person.shape._type.value,
                          }
                        }
                        schema={personDraft}
                        form={personForm}
                        onMutation={handleMutation}
                        resolveInput={resolveInput}
                      />
                      <Flex justify="flex-end" align="flex-end" gap={2}>
                        <Button
                          onClick={() => handleDelete()}
                          text="Delete"
                          tone="critical"
                        />
                      </Flex>
                    </Stack>
                  </Card>
                </TabPanel>
              ))}
            </Stack>
          </Card>
          {local && (
            <Card flex={1} padding={4} shadow={2} radius={2} overflow="auto">
              <Stack space={4}>
                <Heading size={1}>Local</Heading>
                <Text size={1}>
                  <JsonView value={local} />
                </Text>
              </Stack>
            </Card>
          )}
          {server && (
            <Card flex={1} padding={4} shadow={2} radius={2} overflow="auto">
              <Stack space={4}>
                <Heading size={1}>Remote</Heading>
                <Text size={1}>
                  <JsonView value={server} />
                </Text>
              </Stack>
            </Card>
          )}
        </Flex>
        <Flex size={2} gap={2}>
          <Card flex={1} shadow={2} radius={2} height="fill" overflow="auto">
            <Stack space={4} padding={4} height="fill">
              <Flex align="center" justify="center">
                <Box flex={1}>
                  <Heading size={1} textOverflow="ellipsis">
                    Local (optimistic) mutations
                  </Heading>
                </Box>
                <Flex gap={3} align="center" justify="center">
                  <Flex
                    as="label"
                    flex={1}
                    gap={2}
                    align="center"
                    justify="center"
                  >
                    <Checkbox
                      checked={autoOptimize}
                      onChange={e => {
                        setAutoOptimize(e.currentTarget.checked)
                      }}
                    />
                    <Text size={1}>Auto optimize</Text>
                  </Flex>
                  <Button
                    onClick={() => {
                      datastore.optimize()
                    }}
                    mode="ghost"
                    text="Optimize pending"
                  />
                  <Button
                    onClick={() => {
                      datastore.submit()
                    }}
                    text="Submit pending"
                  />
                </Flex>
              </Flex>
              <ScrollBack
                space={5}
                height="fill"
                overflow="auto"
                style={{height: 200}}
              >
                {outbox.map((e, i) => (
                  <Stack key={i} space={4}>
                    {e.mutations.map((m, mi) => (
                      <Flex key={mi} gap={3} align="center">
                        <FormatMutation mutation={m} />
                      </Flex>
                    ))}
                  </Stack>
                ))}
                <div className="end" />
              </ScrollBack>
            </Stack>
          </Card>
          <Card flex={1} shadow={2} radius={2} height="fill">
            <Stack space={4} padding={4} height="fill">
              <Heading size={1}>Remote patches</Heading>
              <ScrollBack space={4} style={{height: 200}}>
                <Grid
                  gap={3}
                  columns={3}
                  style={{gridTemplateColumns: '1fr 2fr 5fr'}}
                >
                  {remoteLogEntries.map((e, i) => (
                    <Fragment key={i}>
                      <Text size={1} muted weight="semibold">
                        {e.type}
                      </Text>
                      <Text size={1} muted>
                        <JsonView oneline value={e.id} />
                      </Text>
                      <Card flex={1}>
                        <Text size={1}>
                          <JsonView
                            oneline
                            value={
                              e.type === 'sync' ? e.document || null : e.effects
                            }
                          />
                        </Text>
                      </Card>
                    </Fragment>
                  ))}
                </Grid>
                <div className="end" />
              </ScrollBack>
            </Stack>
          </Card>
        </Flex>
      </Stack>
    </Card>
  )
}

const ScrollBack = styled(Stack)`
  overflow-y: scroll;
  overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
  .end {
    scroll-snap-align: end;
  }
`
export default App
