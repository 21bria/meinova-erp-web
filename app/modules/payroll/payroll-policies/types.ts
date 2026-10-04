export type PayrollPoliciesRow = {
  id: number
  company: number | null
  company_name?: string | null
  code: string
  name: string
  description: string
  pay_basis: string
  proration_method: string
  prorate_on_join: string
  prorate_on_termination: string
  attendance_deduction_method: string
  deduct_absence: string
  deduct_unpaid_leave: string
  daily_rate_method: string
  daily_rate_divisor: string
  pay_paid_leave: string
  is_active: boolean
  pay_basis_label: string
  proration_method_label: string
  attendance_deduction_method_label: string
  daily_rate_method_label: string
  pay_paid_leave_label: string
  rules_summary: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PayrollPoliciesPayload = {
  id?: number
  company: number | null
  code: string
  name: string
  description: string
  pay_basis: string
  proration_method: string
  prorate_on_join: string
  prorate_on_termination: string
  attendance_deduction_method: string
  deduct_absence: string
  deduct_unpaid_leave: string
  daily_rate_method: string
  daily_rate_divisor: string
  pay_paid_leave: string
  is_active: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}