export type StepsRow = {
  id: number
  is_active: boolean
  workflow: number | null
  workflow_name?: string | null
  step_order: string
  name: string
  approver_type: string
  approver_role: string
  approver_user: number | null
  approver_user_name?: string | null
  require_all: boolean
  id: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type StepsPayload = {
  id?: number
  is_active: boolean
  workflow: number | null
  step_order: string
  name: string
  approver_type: string
  approver_role: string
  approver_user: number | null
  require_all: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}