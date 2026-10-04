export type LeaveRulesRow = {
  id: number
  is_active: boolean
  leave_type: number | null
  leave_type_name?: string | null
  is_unpaid: boolean
  notes: string
  leave_type_code: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type LeaveRulesPayload = {
  id?: number
  is_active: boolean
  leave_type: number | null
  is_unpaid: boolean
  notes: string
}