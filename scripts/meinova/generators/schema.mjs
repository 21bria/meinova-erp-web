function baseUrl() {
  return (process.env.MEINOVA_API_BASE_URL ?? "http://demo.localhost:8000")
    .replace(/\/+$/, "")
}

export function resolveSchemaUrl(modulePath, schemaUrl) {
  if (schemaUrl)
    return schemaUrl

  const cleanModule = modulePath.replace(/^\/+|\/+$/g, "")
  return `${baseUrl()}/api/framework/schema/${cleanModule}/`
}

export async function fetchSchema(schemaUrl) {
  const res = await fetch(schemaUrl)

  if (!res.ok) {
    throw new Error(`Failed to fetch schema: ${res.status} ${res.statusText}`)
  }

  return await res.json()
}