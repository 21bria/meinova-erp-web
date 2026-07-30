export type AuditTrailRow = {
  id: number
  company: number | null
  company_name?: string | null
  site: number | null
  site_name?: string | null
  user: number | null
  user_name?: string | null
  action: string
  module: string
  object_type: string
  object_id: string
  object_repr: string
  before: string
  after: string
  ip_address: string
  user_agent: string
  id: string
  created_at: string
}

export type AuditTrailPayload = {
  id?: number
  company: number | null
  site: number | null
  user: number | null
  action: string
  module: string
  object_type: string
  object_id: string
  object_repr: string
  before: string
  after: string
  ip_address: string
  user_agent: string
}