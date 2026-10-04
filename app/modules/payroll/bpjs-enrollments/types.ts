export type BpjsEnrollmentsRow = {
  id: number
  employee: number | null
  employee_name?: string | null
  program: number | null
  program_name?: string | null
  participates: boolean
  enrolled_from: string
  enrolled_to: string
  risk_class: number | null
  risk_class_name?: string | null
  membership_number: string
  notes: string
  is_active: boolean
  employee_number: string
  program_code: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BpjsEnrollmentsPayload = {
  id?: number
  employee: number | null
  program: number | null
  participates: boolean
  enrolled_from: string
  enrolled_to: string
  risk_class: number | null
  membership_number: string
  notes: string
  is_active: boolean
}