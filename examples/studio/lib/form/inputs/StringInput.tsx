import {TextArea, TextInput} from '@sanity/ui'
import {useCallback} from 'react'
import {at, set, unset} from '@bjoerge/mutiny'
import type {FormEventHandler} from 'react'
import type {InputProps} from '../types'
import type {SanityString} from 'sanitype'

export function StringInput(props: InputProps<SanityString>) {
  const {value, onPatch} = props
  const handleChange: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    useCallback(
      event => {
        onPatch({
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
      [onPatch],
    )

  return props.form?.multiline ? (
    <TextArea value={value || ''} onChange={handleChange} />
  ) : (
    <TextInput value={value || ''} onChange={handleChange} />
  )
}
