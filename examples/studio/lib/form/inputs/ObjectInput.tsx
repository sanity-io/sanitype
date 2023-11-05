import {Card, Stack, Text} from '@sanity/ui'
import {useCallback} from 'react'
import {at, setIfMissing} from '@bjoerge/mutiny'
import {getInstanceName} from 'sanitype'
import type {SanityObject} from 'sanitype'
import type {InputProps, PatchEvent} from '../types'

export function ObjectInput<Schema extends SanityObject>(
  props: InputProps<Schema>,
) {
  const {schema, onPatch, value, resolveInput, form} = props
  const handleFieldPatch = useCallback(
    (fieldName: string, patchEvent: PatchEvent) => {
      const instanceName = getInstanceName(schema)
      onPatch({
        patches: [
          at([], setIfMissing(instanceName ? {_type: instanceName} : {})),
          ...patchEvent.patches.map(patch =>
            at([fieldName, ...patch.path], patch.op),
          ),
        ],
      })
    },
    [schema, onPatch],
  )
  return (
    <Card paddingLeft={3} borderLeft>
      <Stack space={3}>
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
                value={fieldValue}
                onPatch={(patchEvent: PatchEvent) =>
                  handleFieldPatch(fieldName, patchEvent)
                }
                resolveInput={resolveInput}
              />
            </Stack>
          )
        })}
      </Stack>
    </Card>
  )
}
