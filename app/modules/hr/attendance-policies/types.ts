export type AttendancePoliciesRow = {
  id: number
  company: number | null
  company_name?: string | null
  location: number | null
  location_name?: string | null
  employee_group: number | null
  employee_group_name?: string | null
  code: string
  name: string
  description: string
  late_tolerance_minutes: string
  late_counts_from_tolerance: boolean
  early_leave_tolerance_minutes: string
  late_leave_threshold_minutes: string
  early_leave_leave_threshold_minutes: string
  leave_deduction_days: string
  leave_type: number | null
  leave_type_name?: string | null
  require_supervisor_review: boolean
  notify_employee: boolean
  notify_supervisor: boolean
  notify_hr: boolean
  overtime_threshold_minutes: string
  overtime_rounding_minutes: string
  break_minutes: string
  is_active: boolean
  sort_order: string
  scope_label: string
  specificity: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AttendancePoliciesPayload = {
  id?: number
  company: number | null
  location: number | null
  employee_group: number | null
  code: string
  name: string
  description: string
  late_tolerance_minutes: string
  late_counts_from_tolerance: boolean
  early_leave_tolerance_minutes: string
  late_leave_threshold_minutes: string
  early_leave_leave_threshold_minutes: string
  leave_deduction_days: string
  leave_type: number | null
  require_supervisor_review: boolean
  notify_employee: boolean
  notify_supervisor: boolean
  notify_hr: boolean
  overtime_threshold_minutes: string
  overtime_rounding_minutes: string
  break_minutes: string
  is_active: boolean
  sort_order: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}