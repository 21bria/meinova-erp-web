export type ShiftsRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  shift_group: number | null
  shift_group_name?: string | null
  start_time: string
  end_time: string
  break_start_time: string
  break_end_time: string
  crosses_midnight: boolean
  id: string
  shift_group_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type ShiftsPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  shift_group: number | null
  start_time: string
  end_time: string
  break_start_time: string
  break_end_time: string
  crosses_midnight: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}