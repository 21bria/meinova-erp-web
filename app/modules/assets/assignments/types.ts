export type AssignmentsRow = {
  id: number
  is_active: boolean
  document_number: string
  company: number | null
  company_name?: string | null
  asset: number | null
  asset_name?: string | null
  status: string
  source_custody: number | null
  source_custody_name?: string | null
  source_location: number | null
  source_location_name?: string | null
  target_custody_type: string
  employee: number | null
  employee_name?: string | null
  department: number | null
  department_name?: string | null
  pic_employee: number | null
  pic_employee_name?: string | null
  location: number | null
  location_name?: string | null
  facility: number | null
  facility_name?: string | null
  employee_company: number | null
  employee_company_name?: string | null
  employee_location: number | null
  employee_location_name?: string | null
  employee_department: number | null
  employee_department_name?: string | null
  is_cross_company: boolean
  cross_company_reason: string
  purpose: string
  notes: string
  handover_date: string
  handover_condition: string
  resulting_custody: number | null
  resulting_custody_name?: string | null
  submitted_at: string
  approved_at: string
  rejected_at: string
  cancelled_at: string
  completed_at: string
  completed_by: number | null
  completed_by_name?: string | null
  asset_code: string
  created_at: string
  updated_at: string
}

export type AssignmentsPayload = {
  id?: number
  is_active: boolean
  asset: number | null
  target_custody_type: string
  employee: number | null
  department: number | null
  pic_employee: number | null
  location: number | null
  facility: number | null
  cross_company_reason: string
  purpose: string
  notes: string
}