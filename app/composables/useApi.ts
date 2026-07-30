
type HttpMethod =
  | "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  | "get" | "post" | "put" | "patch" | "delete"

type RequestOpts = {
  method?: HttpMethod
  query?: Record<string, any>
  body?: any
  headers?: Record<string, string>
  responseType?: "json" | "blob" | "text" | "arrayBuffer"
}

export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl
  const auth = useAuthStore()

  const cleanQuery = (obj: Record<string, any> = {}) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
    )
  }


  const buildUrl = (path: string, query?: Record<string, any>) => {
    const qs = new URLSearchParams(
      Object.entries(cleanQuery(query)).reduce((acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      }, {} as Record<string, string>)
    ).toString()

    const normalizedBase = String(baseURL || "").replace(/\/$/, "")

    const baseHasApi = normalizedBase.endsWith("/api")
    const pathHasApi = /^\/?api\//.test(path)

    let cleanPath = path

    // Kalau baseURL sudah /api, hapus /api dari path supaya tidak jadi /api/api
    if (baseHasApi && pathHasApi) {
      cleanPath = path.replace(/^\/?api\//, "/")
    }

    const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`

    return `${normalizedBase}${normalizedPath}${qs ? `?${qs}` : ""}`
  }

  const request = async <T = any>(path: string, opts: RequestOpts = {}): Promise<T> => {
    if (import.meta.client && !auth.access && !auth.refresh) {
      auth.loadFromStorage()
    }

    const doFetch = (accessToken?: string) => {
      return $fetch<T>(buildUrl(path), {
        method: opts.method ?? "GET",
        query: cleanQuery(opts.query),
        body: opts.body,
        responseType: opts.responseType ?? "json",
        headers: {
          ...(opts.headers ?? {}),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      })
    }

    try {
      return await doFetch(auth.access)
    } catch (e: any) {
      // if (e?.response?.status === 401 && auth.refresh) {
      //   const newAccess = await auth.refreshToken()
      //   return await doFetch(newAccess)
      // }

      // ACCESS TOKEN EXPIRED
      if (e?.response?.status === 401 && auth.refresh) {
        try {
          const newAccess = await auth.refreshToken()
          return await doFetch(newAccess)
        } catch (refreshError) {
          auth.clear()

          if (import.meta.client) {
            await navigateTo("/login")
          }

          throw refreshError
        }
      }

      throw e
    }
  }

  const rawRequest = async (
    path: string,
    opts: RequestOpts = {}
  ): Promise<Response> => {
    if (import.meta.client && !auth.access && !auth.refresh) {
      auth.loadFromStorage()
    }

    const doFetch = (accessToken?: string) => {
      return fetch(buildUrl(path, opts.query), {
        method: opts.method ?? "GET",
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        headers: {
          "Content-Type": "application/json",
          ...(opts.headers ?? {}),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      })
    }

    let res = await doFetch(auth.access)

    if (res.status === 401 && auth.refresh) {
      try {
        const newAccess = await auth.refreshToken()
        res = await doFetch(newAccess)
      } catch (refreshError) {
        auth.clear()

        if (import.meta.client) {
          await navigateTo("/login")
        }

        throw refreshError
      }
    }

    return res
  }

  return { request, rawRequest, buildUrl, cleanQuery }
}