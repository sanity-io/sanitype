import {expect, test} from 'vitest'

import {toClassicSchema} from '../toClassicSchema'
import {classicHuman} from './schemas/classic'
import {human} from './schemas/typed'

test('toClassicSchema', () => {
  expect(toClassicSchema(human)).toEqual(classicHuman)
})
