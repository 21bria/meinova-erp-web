export type ShiftAssignmentsRow = {
  id: number
  is_active: boolean
  employee: number | null
  employee_name?: string | null
  shift: number | null
  shift_name?: string | null
  kind: string
  layer: string
  start_date: string
  end_date: string
  reason: string
  notes: string
  employee_number: string
  shift_code: string
  shift_start_time: string
  shift_end_time: string
  crosses_midnight: string
  layer_label: string
  kind_label: string
  day_count: number
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type ShiftAssignmentsPayload = {
  id?: number
  is_active: boolean
  employee: number | null
  shift: number | null
  kind: string
  layer: string
  start_date: string
  end_date: string
  reason: string
  notes: string
}