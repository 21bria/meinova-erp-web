export type RotationPurposesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  deducts_leave: boolean
  leave_type: number | null
  leave_type_name?: string | null
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RotationPurposesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  deducts_leave: boolean
  leave_type: number | null
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}