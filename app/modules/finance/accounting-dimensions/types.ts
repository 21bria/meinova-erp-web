export type AccountingDimensionsRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  data_type: string
  lookup_endpoint: string
  lookup_display_key: string
  is_core: boolean
  is_required: boolean
  sort_order: string
  data_type_label: string
  is_locked: boolean
  can_delete: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AccountingDimensionsPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  data_type: string
  lookup_endpoint: string
  lookup_display_key: string
  is_required: boolean
  sort_order: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}