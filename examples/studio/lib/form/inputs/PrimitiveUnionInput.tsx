import {Box, Flex, Select, Stack} from '@sanity/ui'
import {useCallback} from 'react'
import {at, set, unset} from '@bjoerge/mutiny'
import {isLiteralSchema} from 'sanitype'
import type {SanityPrimitiveUnion} from 'sanitype'
import type {InputProps} from '../types'

export function PrimitiveUnionInput(props: InputProps<SanityPrimitiveUnion>) {
  const {value} = props

  const handleReplaceType = useCallback(
    (nextValue: string) =>
      props.onPatch({
        patches: [at([], nextValue === '' ? unset() : set(nextValue))],
      }),
    [props.onPatch],
  )

  const literalTypes = props.schema.union.filter(isLiteralSchema)
  // todo: support non-literal primitives
  return (
    <Stack space={3}>
      <Flex align="center" gap={2}>
        <Select
          value={String(value) || ''}
          space={[3, 3, 4]}
          onChange={e => handleReplaceType(e.currentTarget.value)}
        >
          <option value="">{value ? '' : 'Select…'}</option>
          {literalTypes.map((ut, i) => {
            const literalValue = String(ut.value)
            return (
              <option key={i} value={literalValue}>
                {((props.form as any).types as any)[literalValue]?.title}
              </option>
            )
          })}
        </Select>
      </Flex>
      <Box></Box>
    </Stack>
  )
}
