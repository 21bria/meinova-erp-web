export type LeaveRow = {
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
  leave_type: number | null
  leave_type_name?: string | null
  leave_reason: number | null
  leave_reason_name?: string | null
  start_date: string
  end_date: string
  is_half_day: boolean
  total_days: string
  status: string
  uploaded_file: string
  notes: string
  employee_number: string
  status_label: string
  uploaded_file_detail: string
  workflow: string
  policy_rules: string
  is_editable: string
  can_edit: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type LeavePayload = {
  id?: number
  is_active: boolean
  employee: number | null
  company: number | null
  branch: number | null
  location: number | null
  leave_type: number | null
  leave_reason: number | null
  start_date: string
  end_date: string
  is_half_day: boolean
  total_days: string
  uploaded_file: string
  notes: string
}