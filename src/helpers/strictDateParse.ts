import parseJSON from 'date-fns/parseJSON'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

export function isStrictlyDateTime(input: string) {
  return parseJSON(input).toJSON() === input
}

export function isStrictlyFormatted(input: string, formatStr: string) {
  const parsed = parse(input, formatStr, new Date())
  return isValid(parsed) && format(parsed, formatStr) === input
}
