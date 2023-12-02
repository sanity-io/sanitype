import {Stack, Text} from '@sanity/ui'
import {at, patch} from '@bjoerge/mutiny'
import {useCallback} from 'react'
import type {SanityDocument} from 'sanitype'
import type {DocumentInputProps, PatchEvent} from '../types'

export function DocumentInput<T extends SanityDocument>(
  props: DocumentInputProps<T>,
) {
  const {value, onMutation, schema} = props
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
        const fieldSchema = props.schema.shape[fieldName]
        const fieldValue = value?.[fieldName]
        const Input = props.resolveInput(fieldSchema)
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
              resolveInput={props.resolveInput}
            />
          </Stack>
        )
      })}
    </Stack>
  )
}
