export type WorkCalendarRow = {
  id: number
  is_active: boolean
  scope: string
  company: number | null
  company_name?: string | null
  location: number | null
  location_name?: string | null
  code: string
  name: string
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  is_default: boolean
  applies_to: string
  working_days: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type WorkCalendarPayload = {
  id?: number
  is_active: boolean
  scope: string
  company: number | null
  location: number | null
  code: string
  name: string
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  is_default: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}