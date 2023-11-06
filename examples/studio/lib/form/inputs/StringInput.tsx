import {TextArea, TextInput} from '@sanity/ui'
import {useCallback} from 'react'
import {at, set, unset} from '@bjoerge/mutiny'
import type {FormEventHandler} from 'react'
import type {InputProps} from '../types'
import type {SanityString} from 'sanitype'

export function StringInput(props: InputProps<SanityString>) {
  const handleChange: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    useCallback(
      event => {
        props.onPatch({
          patches: [
            at(
              [],
              event.currentTarget.value
                ? set(event.currentTarget.value)
                : unset(),
            ),
          ],
        })
      },
      [props.onPatch],
    )

  return props.form?.multiline ? (
    <TextArea value={props.value || ''} onChange={handleChange} />
  ) : (
    <TextInput value={props.value || ''} onChange={handleChange} />
  )
}
