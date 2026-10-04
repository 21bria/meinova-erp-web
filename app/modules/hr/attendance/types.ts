export type AttendanceRow = {
  id: number
  employee: number | null
  employee_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  work_date: string
  shift: number | null
  shift_name?: string | null
  status: string
  source: string
  approval_status: string
  scheduled_check_in: string
  scheduled_check_out: string
  check_in: string
  check_out: string
  first_check_in: string
  last_check_out: string
  worked_minutes: number
  break_minutes: number
  late_minutes: number
  early_leave_minutes: number
  overtime_minutes: number
  excused_late_minutes: string
  excused_early_leave_minutes: string
  permission_minutes: string
  is_excused_absence: boolean
  permission_state: string
  leave_required_days: string
  leave_required_reason: string
  leave_required_override: string
  leave_required_waived: boolean
  leave_required_waiver_reason: string
  review_decision: string
  review_notes: string
  reviewed_at: string
  reviewed_by: number | null
  reviewed_by_name?: string | null
  leave: string
  check_in_latitude: number
  check_in_longitude: number
  check_out_latitude: number
  check_out_longitude: number
  check_in_address: string
  check_out_address: string
  is_geofence_valid: boolean
  external_id: string
  device_code: string
  import_batch_id: string
  is_manual_adjustment: boolean
  adjustment_reason: string
  notes: string
  approved_at: string
  approved_by: number | null
  approved_by_name?: string | null
  employee_number: string
  status_label: string
  source_label: string
  approval_status_label: string
  leave_required_effective: string
  leave_obligation_status: string
  leave_obligation_label: string
  leave_required_reason_label: string
  review_decision_label: string
  leave_document_number: string
  unauthorized_late_minutes: string
  unauthorized_early_leave_minutes: string
  permission_state_label: string
  permissions: string
  created_at: string
  updated_at: string
  deleted_at: string
  is_deleted: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AttendancePayload = {
  id?: number
  employee: number | null
  company: number | null
  branch: number | null
  location: number | null
  work_date: string
  shift: number | null
  status: string
  source: string
  approval_status: string
  scheduled_check_in: string
  scheduled_check_out: string
  check_in: string
  check_out: string
  first_check_in: string
  last_check_out: string
  worked_minutes: number
  break_minutes: number
  late_minutes: number
  early_leave_minutes: number
  overtime_minutes: number
  check_in_latitude: number
  check_in_longitude: number
  check_out_latitude: number
  check_out_longitude: number
  check_in_address: string
  check_out_address: string
  is_geofence_valid: boolean
  external_id: string
  device_code: string
  import_batch_id: string
  is_manual_adjustment: boolean
  adjustment_reason: string
  notes: string
}