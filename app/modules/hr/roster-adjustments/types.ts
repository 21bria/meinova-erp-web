export type RosterAdjustmentsRow = {
  id: number
  is_active: boolean
  document_number: string
  plan: number | null
  plan_name?: string | null
  employee: number | null
  employee_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  adjustment_kind: string
  effective_date: string
  segment: number | null
  segment_name?: string | null
  days: string
  new_cycle_start: string
  credit_impact: string
  credit_days: string
  reason: string
  reference: string
  status: string
  submitted_at: string
  submitted_by: number | null
  submitted_by_name?: string | null
  applied_at: string
  apply_error: string
  resulting_version: number | null
  resulting_version_name?: string | null
  employee_number: string
  plan_label: string
  adjustment_kind_label: string
  credit_impact_label: string
  status_label: string
  credit_balance: string
  workflow: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RosterAdjustmentsPayload = {
  id?: number
  is_active: boolean
  document_number: string
  plan: number | null
  company: number | null
  branch: number | null
  location: number | null
  adjustment_kind: string
  effective_date: string
  segment: number | null
  days: string
  new_cycle_start: string
  credit_impact: string
  credit_days: string
  reason: string
  reference: string
}