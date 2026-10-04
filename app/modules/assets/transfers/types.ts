export type TransfersRow = {
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
  source_custody_type: string
  source_location: number | null
  source_location_name?: string | null
  source_facility: number | null
  source_facility_name?: string | null
  source_employee: number | null
  source_employee_name?: string | null
  source_department: number | null
  source_department_name?: string | null
  source_pic_employee: number | null
  source_pic_employee_name?: string | null
  target_custody_type: string
  target_employee: number | null
  target_employee_name?: string | null
  target_department: number | null
  target_department_name?: string | null
  target_pic_employee: number | null
  target_pic_employee_name?: string | null
  target_location: number | null
  target_location_name?: string | null
  target_facility: number | null
  target_facility_name?: string | null
  employee_company: number | null
  employee_company_name?: string | null
  employee_location: number | null
  employee_location_name?: string | null
  employee_department: number | null
  employee_department_name?: string | null
  is_cross_company: boolean
  cross_company_reason: string
  reason: string
  notes: string
  transfer_date: string
  transfer_condition: string
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

export type TransfersPayload = {
  id?: number
  is_active: boolean
  asset: number | null
  target_custody_type: string
  target_employee: number | null
  target_department: number | null
  target_pic_employee: number | null
  target_location: number | null
  target_facility: number | null
  cross_company_reason: string
  reason: string
  notes: string
}