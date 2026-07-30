const cache = new Map<string, Map<number, string>>()

export function getEndpointCache(endpoint: string) {
  if (!cache.has(endpoint)) cache.set(endpoint, new Map())
  return cache.get(endpoint)!
}