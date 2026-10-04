export type DelegationsRow = {
  id: number
  is_active: boolean
  delegator: number | null
  delegator_name?: string | null
  delegate: number | null
  delegate_name?: string | null
  module: string
  document_type: string
  starts_at: string
  ends_at: string
  reason: string
  scope_label: string
  is_running: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type DelegationsPayload = {
  id?: number
  is_active: boolean
  delegator: number | null
  delegate: number | null
  module: string
  document_type: string
  starts_at: string
  ends_at: string
  reason: string
}