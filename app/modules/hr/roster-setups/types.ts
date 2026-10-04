export type RosterSetupsRow = {
  id: number
  is_active: boolean
  document_number: string
  company: number | null
  company_name?: string | null
  location: number | null
  location_name?: string | null
  department: number | null
  department_name?: string | null
  section: number | null
  section_name?: string | null
  as_of_date: string
  horizon_months: string
  status: string
  notes: string
  submitted_at: string
  submitted_by: number | null
  submitted_by_name?: string | null
  committed_at: string
  commit_error: string
  status_label: string
  line_count: string
  committed_count: string
  workflow: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RosterSetupsPayload = {
  id?: number
  is_active: boolean
  document_number: string
  company: number | null
  location: number | null
  department: number | null
  section: number | null
  as_of_date: string
  horizon_months: string
  notes: string
}