import {expect, test} from 'vitest'
import {v3ToNextSchema} from '../v3ToNextSchema'
import {v3Human} from './schemas/v3'
import {human} from './schemas/next'

test('v3ToNextSchema', () => {
  expect(v3ToNextSchema(v3Human)).toEqual([human])
})
