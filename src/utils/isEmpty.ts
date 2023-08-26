export function isEmpty(obj: any) {
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) return false
  }
  return true
}
