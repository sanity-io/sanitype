import {Stack, Text} from '@sanity/ui'
import {at, patch} from '@bjoerge/mutiny'
import {memo, useCallback, useMemo} from 'react'
import type {
  CommonFieldOptions,
  Infer,
  SanityAny,
  SanityFormDef,
} from 'sanitype'
import type {ComponentType} from 'react'
import type {SanityDocument, SanityType} from 'sanitype'
import type {DocumentInputProps, InputProps, PatchEvent} from '../types'

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

export type FieldProps<Schema extends SanityAny> = {
  schema: Schema
  name: string
  value?: Infer<Schema>
  options: CommonFieldOptions
  onPatch: (fieldName: string, patchEvent: PatchEvent) => void
  // onMutate: (mutationEvent: MutationEvent) => void // todo: consider support for patching other documents too
  resolveInput: <T extends SanityAny>(schema: T) => ComponentType<InputProps<T>>
}

const Field = memo(function Field<Schema extends SanityType>(
  props: FieldProps<Schema>,
) {
  const {schema, name, value, resolveInput, onPatch, options} = props

  const handlePatch = useCallback(
    (patchEvent: PatchEvent) => onPatch(name, patchEvent),
    [name, onPatch],
  )
  const Input = useMemo(() => resolveInput(schema), [resolveInput, schema])
  return (
    <Stack space={3}>
      <label>
        <Text size={1} weight="semibold">
          {options.title}
        </Text>
      </label>
      <Input
        schema={schema}
        onPatch={handlePatch}
        value={value}
        resolveInput={resolveInput}
        form={options.form as SanityFormDef<Schema>}
      />
    </Stack>
  )
})
