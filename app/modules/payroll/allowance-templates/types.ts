export type AllowanceTemplatesRow = {
  id: number
  code: string
  name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AllowanceTemplatesPayload = {
  id?: number
  code: string
  name: string
  description: string
  is_active: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}