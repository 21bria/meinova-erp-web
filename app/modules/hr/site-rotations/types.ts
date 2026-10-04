export type SiteRotationsRow = {
  id: number
  is_active: boolean
  document_number: string
  employee: number | null
  employee_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  roster_crew: number | null
  roster_crew_name?: string | null
  roster_policy: number | null
  roster_policy_name?: string | null
  cycle_start: string
  roster_start_basis: string
  travel_out_days: string
  travel_in_days: string
  travel_day_mode: string
  travel_creates_segment: boolean
  travel_out_counts_as_roster_day: boolean
  travel_in_counts_as_roster_day: boolean
  effective_from: string
  effective_to: string
  horizon_end: string
  current_version: number | null
  current_version_name?: string | null
  baseline_version: number | null
  baseline_version_name?: string | null
  submitted_at: string
  submitted_by: number | null
  submitted_by_name?: string | null
  approved_at: string
  approved_by: number | null
  approved_by_name?: string | null
  locked_at: string
  setup_line: number | null
  setup_line_name?: string | null
  cycle_work_days: string
  cycle_off_days: string
  cycle_travel_days: string
  start_date: string
  cycle_count: string
  end_date: string
  status: string
  notes: string
  employee_number: string
  status_label: string
  point_of_hire_name: string
  department_name: string
  section_name: string
  position_name: string
  work_email: string
  phone_number: string
  join_date: string
  cycle_length: string
  cycles_per_year: string
  period_count: string
  schedule_warnings: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
  approval: string
}

export type SiteRotationsPayload = {
  id?: number
  is_active: boolean
  document_number: string
  employee: number | null
  company: number | null
  branch: number | null
  location: number | null
  roster_crew: number | null
  roster_policy: number | null
  cycle_start: string
  roster_start_basis: string
  travel_out_days: string
  travel_in_days: string
  travel_day_mode: string
  travel_creates_segment: boolean
  travel_out_counts_as_roster_day: boolean
  travel_in_counts_as_roster_day: boolean
  effective_from: string
  effective_to: string
  horizon_end: string
  current_version: number | null
  baseline_version: number | null
  submitted_at: string
  submitted_by: number | null
  approved_at: string
  approved_by: number | null
  locked_at: string
  setup_line: number | null
  cycle_work_days: string
  cycle_off_days: string
  cycle_travel_days: string
  start_date: string
  cycle_count: string
  status: string
  notes: string
  approval: string
}