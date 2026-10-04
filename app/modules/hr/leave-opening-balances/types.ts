export type LeaveOpeningBalancesRow = {
  id: number
  is_active: boolean
  employee: number | null
  employee_name?: string | null
  leave_type: number | null
  leave_type_name?: string | null
  opening_date: string
  year: string
  days: string
  expires_at: string
  source: string
  status: string
  posted_at: string
  posted_by: number | null
  posted_by_name?: string | null
  remark: string
  employee_number: string
  source_label: string
  status_label: string
  join_date: string
  eligible_date: string
  validation: string
  validation_label: string
  validation_reason: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type LeaveOpeningBalancesPayload = {
  id?: number
  is_active: boolean
  employee: number | null
  leave_type: number | null
  opening_date: string
  year: string
  days: string
  expires_at: string
  source: string
  remark: string
}