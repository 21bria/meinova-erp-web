export type VisitorRequestsRow = {
  id: number
  is_active: boolean
  document_number: string
  request_date: string
  requester: number | null
  requester_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  visitor_type: string
  employee: number | null
  employee_name?: string | null
  external_visitor: number | null
  external_visitor_name?: string | null
  visit_purpose: number | null
  visit_purpose_name?: string | null
  visit_type: number | null
  visit_type_name?: string | null
  host_employee: number | null
  host_employee_name?: string | null
  visit_start_date: string
  visit_start_time: string
  visit_end_date: string
  visit_end_time: string
  number_of_visitors: string
  remarks: string
  status: string
  travel_required: boolean
  travel_from: string
  travel_to: string
  departure_date: string
  departure_time: string
  return_date: string
  return_time: string
  transport_mode: number | null
  transport_mode_name?: string | null
  ticket_required: boolean
  ticket_number: string
  accommodation_required: boolean
  accommodation_type: number | null
  accommodation_type_name?: string | null
  accommodation_name: string
  accommodation_checkin: string
  accommodation_checkout: string
  pickup_required: boolean
  pickup_point: string
  dropoff_point: string
  vehicle_required: boolean
  driver_required: boolean
  travel_remarks: string
  arrival_status: string
  expected_arrival: string
  checked_in_at: string
  checked_in_by: number | null
  checked_in_by_name?: string | null
  check_in_gate: string
  check_in_remarks: string
  checked_out_at: string
  checked_out_by: number | null
  checked_out_by_name?: string | null
  check_out_remarks: string
  status_label: string
  visitor_type_label: string
  arrival_status_label: string
  visitor_name: string
  visitor_organization: string
  visitor_identity: string
  visitor_contact: string
  employee_number: string
  employee_department: string
  employee_position: string
  employee_location: string
  external_visitor_number: string
  external_visitor_organization: string
  requester_department: string
  host_name: string
  host_department: string
  host_position: string
  host_contact: string
  expected_duration_days: string
  current_pass: string
  pass_count: string
  approval: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type VisitorRequestsPayload = {
  id?: number
  is_active: boolean
  request_date: string
  requester: number | null
  company: number | null
  branch: number | null
  location: number | null
  visitor_type: string
  employee: number | null
  external_visitor: number | null
  visit_purpose: number | null
  visit_type: number | null
  host_employee: number | null
  visit_start_date: string
  visit_start_time: string
  visit_end_date: string
  visit_end_time: string
  number_of_visitors: string
  remarks: string
  travel_required: boolean
  travel_from: string
  travel_to: string
  departure_date: string
  departure_time: string
  return_date: string
  return_time: string
  transport_mode: number | null
  ticket_required: boolean
  ticket_number: string
  accommodation_required: boolean
  accommodation_type: number | null
  accommodation_name: string
  accommodation_checkin: string
  accommodation_checkout: string
  pickup_required: boolean
  pickup_point: string
  dropoff_point: string
  vehicle_required: boolean
  driver_required: boolean
  travel_remarks: string
  expected_arrival: string
  check_in_gate: string
  check_in_remarks: string
  check_out_remarks: string
}