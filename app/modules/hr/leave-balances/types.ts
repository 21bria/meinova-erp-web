export type LeaveBalancesRow = {
  id: number
  is_active: boolean
  employee: number | null
  employee_name?: string | null
  leave_type: number | null
  leave_type_name?: string | null
  year: string
  entitlement: string
  carried_over: string
  opening_balance: string
  opening_expires_at: string
  carried_over_expires_at: string
  carried_over_forfeited: string
  opening_forfeited: string
  adjustment: string
  opening_used: string
  carried_over_used: string
  advance_used: string
  used: string
  notes: string
  employee_number: string
  remaining: string
  entitlement_used: string
  opening_remaining: string
  carried_over_remaining: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type LeaveBalancesPayload = {
  id?: number
  is_active: boolean
  employee: number | null
  leave_type: number | null
  year: string
  entitlement: string
  carried_over: string
  carried_over_expires_at: string
  carried_over_forfeited: string
  adjustment: string
  notes: string
}