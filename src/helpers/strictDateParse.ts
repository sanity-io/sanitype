import {format, isValid, parse, parseJSON} from 'date-fns'

export function isStrictlyDateTime(input: string) {
  return parseJSON(input).toJSON() === input
}

export function isStrictlyFormatted(input: string, formatStr: string) {
  const parsed = parse(input, formatStr, new Date())
  return isValid(parsed) && format(parsed, formatStr) === input
}
