export function getFieldError(errors: Record<string, any> | null | undefined, key: string) {
  const error = errors?.[key]
  return Array.isArray(error) ? error[0] : error ?? null
}