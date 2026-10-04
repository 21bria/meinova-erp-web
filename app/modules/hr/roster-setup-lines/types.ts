export type RosterSetupLinesRow = {
  id: number
  is_active: boolean
  request: number | null
  request_name?: string | null
  employee: number | null
  employee_name?: string | null
  roster_policy: number | null
  roster_policy_name?: string | null
  current_cycle_start: string
  opening_rotation_credit: string
  note: string
  status: string
  commit_error: string
  employee_number: string
  roster_policy_code: string
  status_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RosterSetupLinesPayload = {
  id?: number
  is_active: boolean
  request: number | null
  employee: number | null
  roster_policy: number | null
  current_cycle_start: string
  opening_rotation_credit: string
  note: string
}