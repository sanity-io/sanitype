import {TextInput} from '@sanity/ui'
import {useCallback} from 'react'
import {at, set} from '@bjoerge/mutiny'
import type {FormEventHandler} from 'react'
import type {InputProps} from '../types'
import type {SanityString} from 'sanitype'

export function StringInput(props: InputProps<SanityString>) {
  const handleChange: FormEventHandler<HTMLInputElement> = useCallback(
    event => {
      props.onPatch({patches: [at([], set(event.currentTarget.value))]})
    },
    [props.onPatch],
  )
  return <TextInput value={props.value || ''} onChange={handleChange} />
}
