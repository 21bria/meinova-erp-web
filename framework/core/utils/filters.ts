export function cleanQuery(query: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false
      if (Array.isArray(value) && !value.length) return false
      return true
    }),
  )
}