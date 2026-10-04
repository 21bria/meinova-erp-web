export type ApiKeysRow = {
  id: number
  is_active: boolean
  user: number | null
  user_name?: string | null
  name: string
  prefix: string
  hashed_key: string
  last_used_at: string
  expires_at: string
  allowed_ips: string
  scopes: string
}

export type ApiKeysPayload = {
  id?: number
  is_active: boolean
  user: number | null
  name: string
  expires_at: string
  allowed_ips: string
  scopes: string
}