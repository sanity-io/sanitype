import type {RuleBuilder, SchemaTypeDefinition} from '@sanity/types'
export type RuleCall = {prop: string | symbol; args: any[]}
export function collectValidationRules(type: SchemaTypeDefinition): RuleCall[] {
  const validation = type?.validation
  if (typeof validation !== 'function') {
    return []
  }

  const calls: RuleCall[] = []
  const proxy: RuleBuilder<any> = new Proxy(Object.create(null), {
    get(target, prop, receiver) {
      return (...args: any[]) => {
        calls.push({prop, args})
        return proxy
      }
    },
  })

  validation(proxy)
  return calls
}

export function isOptional(calls: RuleCall[]) {
  const reqIndex = calls.findIndex(call => call.prop === 'required')
  const optionalIndex = calls.findIndex(call => call.prop === 'required')

  return reqIndex === -1 || optionalIndex > reqIndex
}
