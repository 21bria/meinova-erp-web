export type VisitorPassesRow = {
  id: number
  is_active: boolean
  request: number | null
  request_name?: string | null
  pass_number: string
  valid_from: string
  valid_until: string
  status: string
  issued_at: string
  issued_by: number | null
  issued_by_name?: string | null
  returned_at: string
  returned_by: number | null
  returned_by_name?: string | null
  notes: string
  status_label: string
  request_number: string
  visitor_name: string
  visitor_type_label: string
  host_name: string
  location_name: string
  visit_date: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type VisitorPassesPayload = {
  id?: number
  is_active: boolean
  request: number | null
  valid_from: string
  valid_until: string
  status: string
  notes: string
}