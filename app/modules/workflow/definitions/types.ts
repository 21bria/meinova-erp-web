export type DefinitionsRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  module: string
  document_type: string
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  employee_group: number | null
  employee_group_name?: string | null
  version: string
  status: string
  status_label: string
  specificity: string
  step_count: string
  scope_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type DefinitionsPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  module: string
  document_type: string
  company: number | null
  branch: number | null
  location: number | null
  employee_group: number | null
  version: string
  status: string
}