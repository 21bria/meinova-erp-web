export type RegisterRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  asset_code: string
  category: number | null
  category_name?: string | null
  name: string
  description: string
  manufacturer: string
  model: string
  serial_number: string
  tag_number: string
  acquisition_date: string
  acquisition_reference: string
  supplier_name: string
  warranty_until: string
  condition: string
  status: string
  location: number | null
  location_name?: string | null
  facility: number | null
  facility_name?: string | null
  current_custody: number | null
  current_custody_name?: string | null
  activated_at: string
  activated_by: number | null
  activated_by_name?: string | null
  custody_type: string
  custody_employee: string
  custody_employee_name: string
  custody_department_name: string
  custody_pic_name: string
  custody_started_on: string
  custody_holder: string
  current_custody_detail: string
  created_at: string
  updated_at: string
}

export type RegisterPayload = {
  id?: number
  is_active: boolean
  company: number | null
  category: number | null
  name: string
  description: string
  manufacturer: string
  model: string
  serial_number: string
  tag_number: string
  acquisition_date: string
  acquisition_reference: string
  supplier_name: string
  warranty_until: string
  condition: string
  location: number | null
  facility: number | null
}