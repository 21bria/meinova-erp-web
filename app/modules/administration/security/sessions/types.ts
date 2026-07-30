export type SessionRow = {
  id: number
  user: number
  user_name: string
  username?: string | null
  email?: string | null
  session_key: string
  ip_address: string | null
  user_agent: string | null
  device?: string | null
  browser?: string | null
  operating_system?: string | null
  is_current: boolean
  is_active: boolean
  last_activity: string | null
  expires_at: string | null
  created_at: string | null
}

export type SessionPayload = {
  id?: number
}