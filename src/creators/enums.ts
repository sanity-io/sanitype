import {type EnumInput, type NormalizedEnum, type SanityEnum} from '../defs'
import {defineType} from '../helpers/defineType'

export function enums<const Enums extends EnumInput>(
  values: Enums,
): SanityEnum<Enums> {
  return defineType({
    typeName: 'enum',
    enum: (Array.isArray(values)
      ? Object.fromEntries(values.map(v => [v, v]))
      : values) as NormalizedEnum<Enums>,
  })
}
