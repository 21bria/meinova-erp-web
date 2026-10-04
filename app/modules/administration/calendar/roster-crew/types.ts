export type RosterCrewRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  location: number | null
  location_name?: string | null
  code: string
  name: string
  work_schedule: number | null
  work_schedule_name?: string | null
  cycle_start_date: string
  description: string
  cycle_pattern: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RosterCrewPayload = {
  id?: number
  is_active: boolean
  company: number | null
  location: number | null
  code: string
  name: string
  work_schedule: number | null
  cycle_start_date: string
  description: string
}