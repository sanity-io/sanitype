import {expect, test} from 'vitest'

import {number} from '../creators/number'
import {parse} from '../parse'

test('parse a number', () => {
  const numberSchema = number()
  expect(parse(numberSchema, 1)).toEqual(1)
  expect(parse(numberSchema, 1.1)).toEqual(1.1)
})

test('min/max constraints', () => {
  const min1max20 = number({min: 1, max: 20})
  expect(parse(min1max20, 1)).toEqual(1)
  expect(parse(min1max20, 20)).toEqual(20)
  expect(() => parse(min1max20, 0.9)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid input at "<root>": Expected number to be greater than, or equal to 1]`,
  )
  expect(() => parse(min1max20, 20.1)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid input at "<root>": Expected input to be less than, or equal to 20]`,
  )
})

test('lt/gt constraints', () => {
  const gt1lt20 = number({gt: 1, lt: 20})
  expect(parse(gt1lt20, 1.1)).toEqual(1.1)
  expect(parse(gt1lt20, 19.9)).toEqual(19.9)
  expect(() => parse(gt1lt20, 1)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid input at "<root>": Expected number to be greater than 1]`,
  )
  expect(() => parse(gt1lt20, 20)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid input at "<root>": Expected input to be less than 20]`,
  )
})

test('step constraints', () => {
  const multipleOfTwo = number({step: 2})
  expect(parse(multipleOfTwo, 2)).toEqual(2)
  expect(parse(multipleOfTwo, 4)).toEqual(4)
  expect(() => parse(multipleOfTwo, 1)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid input at "<root>": Input must be multiple of 2]`,
  )
  expect(() => parse(multipleOfTwo, 9)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid input at "<root>": Input must be multiple of 2]`,
  )
})
