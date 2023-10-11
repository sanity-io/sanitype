import {Card, Stack, Text} from '@sanity/ui'
import {useCallback} from 'react'
import {at, setIfMissing} from '@bjoerge/mutiny'
import {getInstanceName} from 'sanitype'
import type {SanityObject} from 'sanitype'
import type {InputProps, PatchEvent} from '../types'

export function ObjectInput<Schema extends SanityObject>(
  props: InputProps<Schema>,
) {
  const handleFieldPatch = useCallback(
    (fieldName: string, patchEvent: PatchEvent) => {
      const instanceName = getInstanceName(props.schema)
      props.onPatch({
        patches: [
          at([], setIfMissing(instanceName ? {_type: instanceName} : {})),
          ...patchEvent.patches.map(patch =>
            at([fieldName, ...patch.path], patch.op),
          ),
        ],
      })
    },
    [props.schema, props.onPatch],
  )
  return (
    <Card paddingLeft={3} borderLeft>
      <Stack space={3}>
        {Object.entries(props.form.fields).map(([fieldName, fieldOptions]) => {
          const fieldSchema = props.schema.shape[fieldName]
          const value = props.value?.[fieldName]
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
                value={value}
                onPatch={(patchEvent: PatchEvent) =>
                  handleFieldPatch(fieldName, patchEvent)
                }
                resolveInput={props.resolveInput}
              />
            </Stack>
          )
        })}
      </Stack>
    </Card>
  )
}
