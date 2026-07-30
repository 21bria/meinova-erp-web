export type DefinitionsRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  module: string
  document_type: string
  name: string
  description: string
  id: string
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
  company: number | null
  module: string
  document_type: string
  name: string
  description: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}