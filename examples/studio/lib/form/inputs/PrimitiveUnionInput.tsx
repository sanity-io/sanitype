import {Box, Button, Flex, Select, Stack} from '@sanity/ui'
import {useCallback} from 'react'
import {at, set, unset} from '@bjoerge/mutiny'
import {isLiteralSchema} from 'sanitype'
import {CloseIcon} from '@sanity/icons'
import type {SanityPrimitiveUnion} from 'sanitype'
import type {InputProps} from '../types'

export function PrimitiveUnionInput(props: InputProps<SanityPrimitiveUnion>) {
  const {value} = props

  const handleReplaceType = useCallback(
    (nextValue: string) => {
      props.onPatch({
        patches: [at([], set(nextValue))],
      })
    },
    [props.onPatch],
  )

  const handleClear = useCallback(() => {
    props.onPatch({
      patches: [at([], unset())],
    })
  }, [props.onPatch])

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
          {value ? null : <option value="">Select…</option>}
          {literalTypes.map((ut, i) => {
            const literalValue = String(ut.value)
            return (
              <option key={i} value={literalValue}>
                {((props.form as any).types as any)[literalValue]?.title}
              </option>
            )
          })}
        </Select>
        {value ? (
          <Button
            mode="bleed"
            tone="critical"
            icon={CloseIcon}
            title="Clear"
            onClick={handleClear}
          />
        ) : null}
      </Flex>
      <Box></Box>
    </Stack>
  )
}

function intersection<T1>(a: T1[], b: T1[]): T1[] {
  return a.filter(x => b.includes(x))
}
