export type AccountingPoliciesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  company: number | null
  company_name?: string | null
  event_type: string
  journal_type: string
  effective_from: string
  effective_to: string
  rule_count: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AccountingPoliciesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  company: number | null
  event_type: string
  journal_type: string
  effective_from: string
  effective_to: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}