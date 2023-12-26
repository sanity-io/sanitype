import {expect, test} from 'vitest'

import {nextToV3Schema} from '../nextToV3Schema'
import {v3Human} from './schemas/v3'
import {human} from './schemas/next'

test('toV3Schema', () => {
  expect(nextToV3Schema(human)).toEqual(v3Human)
})
