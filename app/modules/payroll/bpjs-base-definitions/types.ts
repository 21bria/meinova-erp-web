export type BpjsBaseDefinitionsRow = {
  id: number
  code: string
  version: string
  name: string
  description: string
  include_basic: boolean
  daily_basic_method: string
  daily_basic_factor: string
  is_active: boolean
  component_summary: string
  is_referenced: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BpjsBaseDefinitionsPayload = {
  id?: number
  code: string
  version: string
  name: string
  description: string
  include_basic: boolean
  daily_basic_method: string
  daily_basic_factor: string
  is_active: boolean
}