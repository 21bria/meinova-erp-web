export function normalizeApiErrors(error: any): Record<string, any> {
  const data =
    error?.data
    ?? error?.response?._data
    ?? error?.response?.data
    ?? {}

  if (data?.errors && typeof data.errors === "object") {
    return data.errors
  }

  if (data && typeof data === "object") {
    return data
  }

  return {}
}