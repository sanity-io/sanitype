import {Stack, Text} from '@sanity/ui'
import {at} from '@bjoerge/mutiny'
import {useCallback} from 'react'
import type {Draft} from '../../../../../src/lifecycle'
import type {InputProps, PatchEvent} from '../types'
import type {SanityDocument} from 'sanitype'

export function DocumentInput<T extends SanityDocument>(props: InputProps<T>) {
  const {schema, onPatch, resolveInput, form, value} = props
  const handleFieldPatch = useCallback(
    (fieldName: string, patchEvent: PatchEvent) => {
      onPatch({
        patches: [
          ...patchEvent.patches.map(patch =>
            at([fieldName, ...patch.path], patch.op),
          ),
        ],
      })
    },
    [onPatch],
  )
  return (
    <Stack space={4}>
      {Object.entries(form.fields).map(([fieldName, fieldOptions]) => {
        const fieldSchema = schema.shape[fieldName]
        const fieldValue = value?.[fieldName]
        const Input = resolveInput(fieldSchema)
        return (
          <Stack key={fieldName} space={3}>
            <label>
              <Text size={1} weight="semibold">
                {fieldOptions.title}
              </Text>
            </label>
            <Input
              form={fieldOptions.form}
              schema={fieldSchema}
              onPatch={patchEvent => handleFieldPatch(fieldName, patchEvent)}
              value={fieldValue}
              resolveInput={resolveInput}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}
