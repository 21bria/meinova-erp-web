export type HolidayRow = {
  id: number
  is_active: boolean
  scope: string
  company: number | null
  company_name?: string | null
  location: number | null
  location_name?: string | null
  date: string
  code: string
  name: string
  country_code: string
  is_national: boolean
  is_recurring: boolean
  source: string
  external_id: string
  source_url: string
  synced_at: string
  sync_status: string
  applies_to: string
  company_ids: number[]
  selected_companies: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type HolidayPayload = {
  id?: number
  is_active: boolean
  scope: string
  company: number | null
  location: number | null
  date: string
  code: string
  name: string
  country_code: string
  is_national: boolean
  is_recurring: boolean
  source: string
  company_ids: number[]
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}