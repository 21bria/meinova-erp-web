export type VisitPurposesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  requires_approval: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type VisitPurposesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  requires_approval: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}