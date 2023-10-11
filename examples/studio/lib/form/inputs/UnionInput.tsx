import {
  Box,
  Button,
  Card,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  Select,
  Stack,
  Text,
} from '@sanity/ui'
import {useCallback} from 'react'
import {assign, at, set, setIfMissing, unset} from '@bjoerge/mutiny'
import {getInstanceName, isObjectSchema, pickDeep} from 'sanitype'
import {EllipsisVerticalIcon, TransferIcon, TrashIcon} from '@sanity/icons'
import {startCase} from 'lodash'

import {ObjectInput} from './ObjectInput'
import type {ObjectUnionFieldOptions, SanityObjectUnion} from 'sanitype'
import type {MenuButtonProps} from '@sanity/ui'
import type {InputProps, PatchEvent} from '../types'

const NESTED_POPOVER_PROPS: MenuButtonProps['popover'] = {
  placement: 'right-start',
  portal: true,
  preventOverflow: true,
}

export function UnionInput(props: InputProps<SanityObjectUnion>) {
  const {value, schema, onPatch, form, resolveInput} = props
  const valueTypeName = value?._type

  const currentSchema = valueTypeName
    ? schema.union.find(ut => getInstanceName(ut) === valueTypeName)
    : undefined

  const handlePatch = useCallback(
    (patchEvent: PatchEvent) => {
      if (!currentSchema) {
        // note: this should never happen
        throw new Error(`Cannot apply patch. No current to apply patch to`)
      }
      onPatch({
        patches: [
          at([], setIfMissing({_type: getInstanceName(currentSchema!)})),
          ...patchEvent.patches,
        ],
      })
    },
    [onPatch, currentSchema],
  )

  const handleTurnInto = useCallback(
    (nextTypeName: string) => {
      const nextSchema = schema.union.find(
        ut => getInstanceName(ut) === nextTypeName,
      )
      if (!nextSchema) {
        throw new Error(`No valid union type named ${nextTypeName}.`)
      }
      onPatch({
        patches: [
          at([], set({_type: nextTypeName})),
          at([], assign(pickDeep(nextSchema, value))),
        ],
      })
    },
    [onPatch, currentSchema, value, schema],
  )

  const handleSelectType = useCallback(
    (nextTypeName: string) => {
      const nextSchema = schema.union.find(
        ut => getInstanceName(ut) === nextTypeName,
      )
      if (!nextSchema) {
        throw new Error(`No valid union type named ${nextTypeName}.`)
      }
      onPatch({
        patches: [at([], set({_type: nextTypeName}))],
      })
    },
    [onPatch, currentSchema],
  )

  const handleClear = useCallback(
    () =>
      onPatch({
        patches: [at([], unset())],
      }),
    [onPatch],
  )

  if (!currentSchema) {
    return (
      <Select onChange={e => handleSelectType(e.currentTarget.value)}>
        <option value="">Select type</option>
        {schema.union.map(ut => {
          const name = getInstanceName(ut)
          if (!name || !(name in form.types)) {
            throw new Error(`No form definition found for type ${name}`)
          }
          const formDef = (form.types as any)[
            name
          ] as ObjectUnionFieldOptions<any>
          return (
            <option key={name} value={name}>
              {formDef?.title}
            </option>
          )
        })}
      </Select>
    )
  }

  if (!isObjectSchema(currentSchema)) {
    return <Card tone="caution">Type {valueTypeName} not valid for union</Card>
  }

  const unionTypes = schema.union
  const otherTypes = unionTypes.filter(u => u !== currentSchema)
  return (
    <Stack space={3} marginLeft={2}>
      <Flex>
        <Card padding={1} shadow={1} radius={2}>
          <Flex align="center" gap={2}>
            <Box paddingX={2} flex={1}>
              <Text size={1} weight="semibold">
                {startCase(valueTypeName)}
              </Text>
            </Box>
            <MenuButton
              button={
                <Button mode="bleed" padding={2} icon={EllipsisVerticalIcon} />
              }
              id="menu-button-example"
              menu={
                <Menu>
                  <MenuGroup
                    icon={TransferIcon}
                    popover={NESTED_POPOVER_PROPS}
                    text="Turn into…"
                  >
                    {otherTypes.map(type => {
                      const sharedProperties = intersection(
                        Object.keys(type.shape),
                        Object.keys(currentSchema.shape),
                      ).filter(v => v !== '_type')
                      const instanceName = getInstanceName(type)
                      return instanceName ? (
                        <MenuItem
                          key={instanceName}
                          disabled={sharedProperties.length === 0}
                          title={
                            sharedProperties.length === 0
                              ? 'No shared properties'
                              : `Will create a new ${getInstanceName(
                                  type,
                                )} with the following properties carried over from the current value: ${sharedProperties.join(
                                  ', ',
                                )}.`
                          }
                          onClick={() => handleTurnInto(instanceName)}
                          text={startCase(instanceName)}
                        />
                      ) : null
                    })}
                  </MenuGroup>
                  <MenuDivider />
                  <MenuItem
                    icon={TrashIcon}
                    tone="critical"
                    onClick={handleClear}
                    text="Clear"
                  />
                </Menu>
              }
              popover={{portal: true, tone: 'default'}}
            />
          </Flex>
        </Card>
      </Flex>
      <Box>
        <ObjectInput
          schema={currentSchema}
          value={value}
          form={((form.types as any)[valueTypeName!] as any).form}
          onPatch={handlePatch}
          resolveInput={resolveInput}
        />
      </Box>
    </Stack>
  )
}

function intersection<T1>(a: T1[], b: T1[]): T1[] {
  return a.filter(x => b.includes(x))
}