export type BusinessTripsRow = {
  id: number
  is_active: boolean
  document_number: string
  request_date: string
  employee: number | null
  employee_name?: string | null
  requester: number | null
  requester_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  division: number | null
  division_name?: string | null
  department: number | null
  department_name?: string | null
  section: number | null
  section_name?: string | null
  position: number | null
  position_name?: string | null
  cost_center: number | null
  cost_center_name?: string | null
  origin_location: number | null
  origin_location_name?: string | null
  destination_type: string
  destination_location: number | null
  destination_location_name?: string | null
  destination_city: number | null
  destination_city_name?: string | null
  destination_country: number | null
  destination_country_name?: string | null
  destination_detail: string
  purpose_category: string
  purpose: string
  departure_datetime: string
  return_datetime: string
  actual_departure_datetime: string
  actual_return_datetime: string
  supersedes: number | null
  supersedes_name?: string | null
  supersede_type: string
  status: string
  submitted_at: string
  approved_at: string
  rejected_at: string
  departed_at: string
  completed_at: string
  cancelled_at: string
  cancelled_by: number | null
  cancelled_by_name?: string | null
  cancellation_reason: string
  notes: string
  attachment: string
  attachment_detail: string
  employee_number: string
  supersedes_number: string
  destination_summary: string
  status_label: string
  purpose_category_label: string
  destination_type_label: string
  supersede_type_label: string
  is_editable: string
  departure_date: string
  return_date: string
  legs: string
  approval: string
  superseded_by: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BusinessTripsPayload = {
  id?: number
  is_active: boolean
  request_date: string
  employee: number | null
  origin_location: number | null
  destination_type: string
  destination_location: number | null
  destination_city: number | null
  destination_country: number | null
  destination_detail: string
  purpose_category: string
  purpose: string
  departure_datetime: string
  return_datetime: string
  supersedes: number | null
  supersede_type: string
  notes: string
  attachment: string
}