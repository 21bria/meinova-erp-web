export type LeavePoliciesRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  leave_type: number | null
  leave_type_name?: string | null
  code: string
  name: string
  description: string
  employee_group: number | null
  employee_group_name?: string | null
  employment_type: number | null
  employment_type_name?: string | null
  uses_balance: boolean
  entitlement_days: string
  accrual: string
  period_basis: string
  eligible_after_months: string
  prorate_first_period: boolean
  allow_carry_over: boolean
  carry_over_max_days: string
  carry_over_expiry_months: string
  carry_over_reminder_days: string
  max_days: string
  per_event: boolean
  document_required: boolean
  history_check: boolean
  history_action: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type LeavePoliciesPayload = {
  id?: number
  is_active: boolean
  company: number | null
  leave_type: number | null
  code: string
  name: string
  description: string
  employee_group: number | null
  employment_type: number | null
  uses_balance: boolean
  entitlement_days: string
  accrual: string
  period_basis: string
  eligible_after_months: string
  prorate_first_period: boolean
  allow_carry_over: boolean
  carry_over_max_days: string
  carry_over_expiry_months: string
  carry_over_reminder_days: string
  max_days: string
  per_event: boolean
  document_required: boolean
  history_check: boolean
  history_action: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}