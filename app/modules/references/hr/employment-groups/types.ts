export type EmploymentGroupsRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  attendance_applicable: boolean
  leave_applicable: boolean
  roster_applicable: boolean
  shift_applicable: boolean
  overtime_applicable: boolean
  field_break_applicable: boolean
  business_trip_applicable: boolean
  travel_document: string
  travel_document_warnings: { kind: string, message: string }[]
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type EmploymentGroupsPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  description: string
  sort_order: string
  attendance_applicable: boolean
  leave_applicable: boolean
  roster_applicable: boolean
  shift_applicable: boolean
  overtime_applicable: boolean
  field_break_applicable: boolean
  business_trip_applicable: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}