export type TravelRequestsRow = {
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
  rotation_period: number | null
  rotation_period_name?: string | null
  start_date: string
  end_date: string
  total_days: string
  status: string
  notes: string
  employee_number: string
  status_label: string
  department_name: string
  section_name: string
  position_name: string
  point_of_hire_name: string
  join_date: string
  work_email: string
  phone_number: string
  rotation_period_label: string
  leave_balances: string
  approval: string
  purpose_count: string
  is_editable: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type TravelRequestsPayload = {
  id?: number
  is_active: boolean
  document_number: string
  employee: number | null
  company: number | null
  branch: number | null
  location: number | null
  rotation_period: number | null
  start_date: string
  end_date: string
  notes: string
}