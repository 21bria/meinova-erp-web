export type AccountMappingsRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  mapping_key: string
  company: number | null
  company_name?: string | null
  event_type: string
  selectors: string
  location: number | null
  location_name?: string | null
  department: number | null
  department_name?: string | null
  cost_center: number | null
  cost_center_name?: string | null
  account: number | null
  account_name?: string | null
  specificity: string
  effective_from: string
  effective_to: string
  account_code: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AccountMappingsPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  mapping_key: string
  company: number | null
  event_type: string
  selectors: string
  location: number | null
  department: number | null
  cost_center: number | null
  account: number | null
  effective_from: string
  effective_to: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}