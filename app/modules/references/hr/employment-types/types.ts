export type EmploymentTypesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  requires_contract: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type EmploymentTypesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  requires_contract: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}