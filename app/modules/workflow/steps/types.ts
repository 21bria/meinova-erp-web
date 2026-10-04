export type StepsRow = {
  id: number
  is_active: boolean
  definition: number | null
  definition_name?: string | null
  sequence: string
  name: string
  description: string
  approver_type: string
  approver_user: number | null
  approver_user_name?: string | null
  approver_role: number | null
  approver_role_name?: string | null
  approver_position: number | null
  approver_position_name?: string | null
  level: string
  approver_scope: string
  fallback_role: number | null
  fallback_role_name?: string | null
  approval_mode: string
  minimum_approvals: string
  can_reject: boolean
  can_return: boolean
  is_required: boolean
  condition: string
  approver_type_label: string
  approval_mode_label: string
  approver_scope_label: string
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
  definition: number | null
  sequence: string
  name: string
  description: string
  approver_type: string
  approver_user: number | null
  approver_role: number | null
  approver_position: number | null
  level: string
  approver_scope: string
  fallback_role: number | null
  approval_mode: string
  minimum_approvals: string
  can_reject: boolean
  can_return: boolean
  is_required: boolean
  condition: string
}