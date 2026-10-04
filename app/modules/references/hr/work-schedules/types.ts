export type WorkSchedulesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  schedule_type: string
  standard_hours_per_day: string
  standard_hours_per_week: string
  work_days: string
  cycle_work_days: string
  cycle_off_days: string
  is_flexible: boolean
  crosses_midnight: boolean
  schedule_days: string
  schedule_type_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type WorkSchedulesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  schedule_type: string
  standard_hours_per_day: string
  standard_hours_per_week: string
  work_days: string
  cycle_work_days: string
  cycle_off_days: string
  is_flexible: boolean
  crosses_midnight: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}