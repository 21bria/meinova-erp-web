export type PayrollRunsRow = {
  id: number
  is_active: boolean
  document_number: string
  period: number | null
  period_name?: string | null
  company: number | null
  company_name?: string | null
  name: string
  run_type: string
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  department: number | null
  department_name?: string | null
  section: number | null
  section_name?: string | null
  status: string
  employee_count: string
  total_earning: string
  total_deduction: string
  total_tax: string
  total_net: string
  total_employer_contribution: string
  validation_summary: string
  warnings_acknowledged: boolean
  acknowledged_at: string
  acknowledged_by: number | null
  acknowledged_by_name?: string | null
  calculated_at: string
  calculated_by: number | null
  calculated_by_name?: string | null
  submitted_at: string
  submitted_by: number | null
  submitted_by_name?: string | null
  approved_at: string
  approved_by: number | null
  approved_by_name?: string | null
  finalized_at: string
  finalized_by: number | null
  finalized_by_name?: string | null
  notes: string
  period_code: string
  period_start_date: string
  period_end_date: string
  error_count: string
  warning_count: string
  approval: string
  can_edit: string
  can_save: string
  can_delete: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PayrollRunsPayload = {
  id?: number
  is_active: boolean
  document_number: string
  period: number | null
  name: string
  run_type: string
  branch: number | null
  location: number | null
  department: number | null
  section: number | null
  total_employer_contribution: string
  notes: string
}