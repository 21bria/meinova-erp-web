export type CategoriesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  requires_serial_number: boolean
  allow_employee_custody: boolean
  allow_organization_custody: boolean
  created_at: string
  updated_at: string
}

export type CategoriesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  requires_serial_number: boolean
  allow_employee_custody: boolean
  allow_organization_custody: boolean
}