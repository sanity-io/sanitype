import {Checkbox} from '@sanity/ui'
import {useCallback} from 'react'
import {at, set} from '@bjoerge/mutiny'
import type {FormEventHandler} from 'react'
import type {InputProps} from '../types'
import type {SanityBoolean} from 'sanitype'

export function BooleanInput(props: InputProps<SanityBoolean>) {
  const {onPatch} = props
  const handleChange: FormEventHandler<HTMLInputElement> = useCallback(
    event => {
      onPatch({patches: [at([], set(event.currentTarget.checked))]})
    },
    [onPatch],
  )
  return <Checkbox checked={props.value || false} onChange={handleChange} />
}
