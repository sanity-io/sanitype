import {Card, Stack} from '@sanity/ui'
import {at, setIfMissing} from '@bjoerge/mutiny'
import {useCallback} from 'react'
import {getInstanceName} from 'sanitype'
import {Field} from './Field'
import type {InputProps, PatchEvent} from '../../types'
import type {SanityObject} from 'sanitype'

export function ObjectInput<T extends SanityObject>(props: InputProps<T>) {
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
    </Card>
  )
}
