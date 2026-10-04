export type RosterShiftRotationsRow = {
  id: number
  is_active: boolean
  policy: number | null
  policy_name?: string | null
  sequence: string
  shift: number | null
  shift_name?: string | null
  block_days: string
  notes: string
  shift_code: string
  shift_start_time: string
  shift_end_time: string
  crosses_midnight: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RosterShiftRotationsPayload = {
  id?: number
  is_active: boolean
  policy: number | null
  sequence: string
  shift: number | null
  block_days: string
  notes: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}