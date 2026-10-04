export type BusinessTripLegsRow = {
  id: number
  is_active: boolean
  trip: number | null
  trip_name?: string | null
  direction: string
  sequence: string
  travel_start_date: string
  travel_end_date: string
  origin: string
  destination: string
  transport_mode: number | null
  transport_mode_name?: string | null
  transport_detail: string
  ticket_number: string
  accommodation_needed: boolean
  accommodation_type: number | null
  accommodation_type_name?: string | null
  accommodation_name: string
  check_in_date: string
  check_out_date: string
  notes: string
  direction_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BusinessTripLegsPayload = {
  id?: number
  is_active: boolean
  trip: number | null
  direction: string
  sequence: string
  travel_start_date: string
  travel_end_date: string
  origin: string
  destination: string
  transport_mode: number | null
  transport_detail: string
  ticket_number: string
  accommodation_needed: boolean
  accommodation_type: number | null
  accommodation_name: string
  check_in_date: string
  check_out_date: string
  notes: string
}