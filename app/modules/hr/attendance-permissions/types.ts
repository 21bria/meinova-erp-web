export type AttendancePermissionsRow = {
  id: number
  is_active: boolean
  document_number: string
  employee: number | null
  employee_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  permission_type: string
  date: string
  start_time: string
  end_time: string
  reason: string
  notes: string
  supporting_document: string
  status: string
  allow_outside_shift: boolean
  outside_shift_reason: string
  submitted_at: string
  approved_at: string
  rejected_at: string
  cancelled_at: string
  employee_number: string
  permission_type_label: string
  status_label: string
  duration_minutes: string
  supporting_document_detail: string
  shift: string
  attendance: string
  conflicts: string
  approval: string
  time_window: string
  current_approver: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AttendancePermissionsPayload = {
  id?: number
  is_active: boolean
  employee: number | null
  permission_type: string
  date: string
  start_time: string
  end_time: string
  reason: string
  notes: string
  supporting_document: string
  allow_outside_shift: boolean
  outside_shift_reason: string
}