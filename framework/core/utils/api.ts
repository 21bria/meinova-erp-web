export type ApiErrorRecord =
  Record<string, unknown>

export type ApiResponse<T> = {
  success?: boolean
  message?: string
  data: T
  errors?: ApiErrorRecord
}

export function isApiResponse<T>(
  value: unknown,
): value is ApiResponse<T> {
  return (
    value !== null
    && typeof value === "object"
    && "data" in value
  )
}

export function unwrapResponse<T>(
  value: ApiResponse<T> | T,
): T {
  if (isApiResponse<T>(value))
    return value.data

  return value
}

export function normalizeApiError(
  error: unknown,
  fallback = "Unexpected error.",
): ApiErrorRecord {
  const current = error as {
    data?: unknown
    response?: {
      _data?: unknown
      data?: unknown
    }
  }

  const response =
    current.data
    ?? current.response?._data
    ?? current.response?.data

  if (
    response
    && typeof response === "object"
    && !Array.isArray(response)
  ) {
    const payload =
      response as Record<
        string,
        unknown
      >

    if (
      payload.errors
      && typeof payload.errors
        === "object"
      && !Array.isArray(
        payload.errors,
      )
    ) {
      return payload.errors as ApiErrorRecord
    }

    if (
      payload.data
      && typeof payload.data
        === "object"
      && !Array.isArray(
        payload.data,
      )
    ) {
      return payload.data as ApiErrorRecord
    }

    return payload
  }

  return {
    detail: [
      fallback,
    ],
  }
}