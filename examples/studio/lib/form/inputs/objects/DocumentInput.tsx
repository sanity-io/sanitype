import {Stack} from '@sanity/ui'
import {at, patch} from '@bjoerge/mutiny'
import {useCallback} from 'react'
import {Field} from './Field'
import type {DocumentInputProps, PatchEvent} from '../../types'
import type {SanityDocument} from 'sanitype'

export function DocumentInput<T extends SanityDocument>(
  props: DocumentInputProps<T>,
) {
  const {value, onMutation, resolveInput} = props
  const handleFieldPatch = useCallback(
    (fieldName: string, patchEvent: PatchEvent) => {
      onMutation({
        mutations: patchEvent.patches.map(nodePatch =>
          patch(value._id, at([fieldName, ...nodePatch.path], nodePatch.op)),
        ),
      })
    },
    [onMutation, value._id],
  )
  return (
    <Stack space={4}>
      {Object.entries(props.form.fields).map(([fieldName, fieldOptions]) => {
        return (
          <Field
            resolveInput={resolveInput}
            key={fieldName}
            schema={props.schema.shape[fieldName]}
            value={value?.[fieldName]}
            onPatch={handleFieldPatch}
            options={fieldOptions}
            name={fieldName}
          />
        )
      })}
    </Stack>
  )
}
