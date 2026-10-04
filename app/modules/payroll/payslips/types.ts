export type PayslipsRow = {
  id: number
  is_active: boolean
  run_employee: number | null
  run_employee_name?: string | null
  document_number: string
  run: number | null
  run_name?: string | null
  period: number | null
  period_name?: string | null
  employee: number | null
  employee_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  division: number | null
  division_name?: string | null
  department: number | null
  department_name?: string | null
  section: number | null
  section_name?: string | null
  issue_date: string
  basic_salary: string
  gross_earning: string
  total_deduction: string
  tax_amount: string
  net_pay: string
  employer_contribution: string
  snapshot: string
  status: string
  published_at: string
  published_by: number | null
  published_by_name?: string | null
  notes: string
  employee_number: string
  period_code: string
  run_document_number: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PayslipsPayload = {
  id?: number
}