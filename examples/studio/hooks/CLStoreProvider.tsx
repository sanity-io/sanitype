import {createContext, useContext} from 'react'
import type {ContentLakeStore} from '@bjoerge/mutiny/_unstable_store'
import type {ReactNode} from 'react'

const CLStoreContext = createContext<ContentLakeStore | null>(null)

export function CLStoreProvider(props: {
  store: ContentLakeStore
  children: ReactNode
}) {
  return (
    <CLStoreContext.Provider value={props.store}>
      {props.children}
    </CLStoreContext.Provider>
  )
}

export function useCLStore() {
  const ctx = useContext(CLStoreContext)
  if (!ctx) {
    throw new Error('Expected Content Lake Store to be in context')
  }
  return ctx
}
