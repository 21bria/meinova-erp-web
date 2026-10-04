export type OvertimeRow = {
  id: number
  is_active: boolean
  employee: number | null
  employee_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  overtime_type: number | null
  overtime_type_name?: string | null
  work_date: string
  start_time: string
  end_time: string
  duration_minutes: string
  status: string
  is_paid: boolean
  reason: string
  notes: string
  employee_number: string
  status_label: string
  duration_hours: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type OvertimePayload = {
  id?: number
  is_active: boolean
  employee: number | null
  company: number | null
  branch: number | null
  location: number | null
  overtime_type: number | null
  work_date: string
  start_time: string
  end_time: string
  duration_minutes: string
  status: string
  is_paid: boolean
  reason: string
  notes: string
}