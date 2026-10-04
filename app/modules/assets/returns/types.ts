export type ReturnsRow = {
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
  destination_location: number | null
  destination_location_name?: string | null
  destination_facility: number | null
  destination_facility_name?: string | null
  reason: string
  notes: string
  return_date: string
  return_condition: string
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

export type ReturnsPayload = {
  id?: number
  is_active: boolean
  asset: number | null
  destination_location: number | null
  destination_facility: number | null
  reason: string
  notes: string
}