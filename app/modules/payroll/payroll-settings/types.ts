export type PayrollSettingsRow = {
  id: number
  company: number | null
  company_name?: string | null
  proration_method: string
  prorate_on_join: boolean
  prorate_on_termination: boolean
  attendance_deduction_method: string
  deduct_absence: boolean
  deduct_unpaid_leave: boolean
  is_active: boolean
  proration_method_label: string
  attendance_deduction_method_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PayrollSettingsPayload = {
  id?: number
  company: number | null
  proration_method: string
  prorate_on_join: boolean
  prorate_on_termination: boolean
  attendance_deduction_method: string
  deduct_absence: boolean
  deduct_unpaid_leave: boolean
  is_active: boolean
}