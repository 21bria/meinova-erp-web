export type DelegationsRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  site: number | null
  site_name?: string | null
  workflow: number | null
  workflow_name?: string | null
  delegator: number | null
  delegator_name?: string | null
  delegate: number | null
  delegate_name?: string | null
  start_date: string
  end_date: string
  reason: string
  id: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type DelegationsPayload = {
  id?: number
  is_active: boolean
  company: number | null
  site: number | null
  workflow: number | null
  delegator: number | null
  delegate: number | null
  start_date: string
  end_date: string
  reason: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}