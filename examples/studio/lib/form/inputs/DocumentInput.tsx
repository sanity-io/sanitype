import {Stack, Text} from '@sanity/ui'
import {at} from '@bjoerge/mutiny'
import {useCallback} from 'react'
import type {InputProps, PatchEvent} from '../types'
import type {SanityDocument} from 'sanitype'

export function DocumentInput<T extends SanityDocument>(props: InputProps<T>) {
  const handleFieldPatch = useCallback(
    (fieldName: string, patchEvent: PatchEvent) => {
      props.onPatch({
        patches: [
          ...patchEvent.patches.map(patch =>
            at([fieldName, ...patch.path], patch.op),
          ),
        ],
      })
    },
    [props.schema, props.onPatch],
  )
  return (
    <Stack space={3}>
      {Object.entries(props.form.fields).map(([fieldName, fieldOptions]) => {
        const fieldSchema = props.schema.shape[fieldName]
        const value = props.value?.[fieldName]
        const Input = props.resolveInput(fieldSchema)
        return (
          <Stack key={fieldName} space={3}>
            <label>
              <Text>{fieldOptions.title}</Text>
            </label>
            <Input
              form={fieldOptions.form}
              schema={fieldSchema}
              onPatch={patchEvent => handleFieldPatch(fieldName, patchEvent)}
              value={value}
              resolveInput={props.resolveInput}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}
