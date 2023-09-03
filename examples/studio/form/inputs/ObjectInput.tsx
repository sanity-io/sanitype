import {Box, Card, Stack, Text} from '@sanity/ui'
import {useCallback} from 'react'
import {at, setIfMissing} from '@bjoerge/mutiny'
import {isLiteralSchema} from '../../../../src/asserters'
import type {InputProps, PatchEvent} from '../types'
import type {SanityAny, SanityObject} from 'sanitype'

function getTypeAnnotation(schema: SanityObject) {
  const typeLiteral = schema.shape?._type
  return typeLiteral && isLiteralSchema(typeLiteral)
    ? typeLiteral.value
    : undefined
}

export function ObjectInput<Schema extends SanityObject>(
  props: InputProps<Schema>,
) {
  const handleFieldPatch = useCallback(
    (fieldName: string, patchEvent: PatchEvent) => {
      props.onPatch({
        patches: [
          at([], setIfMissing({_type: getTypeAnnotation(props.schema)})),
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
            <Stack key={fieldName} space={2}>
              <label>
                <Text>{fieldOptions.title}</Text>
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
