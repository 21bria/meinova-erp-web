export type RotationCreditsRow = {
  id: number
  is_active: boolean
  employee: number | null
  employee_name?: string | null
  entry_type: string
  days: string
  transaction_date: string
  effective_date: string
  source_type: string
  source_id: string
  plan: number | null
  plan_name?: string | null
  segment: number | null
  segment_name?: string | null
  remainder_days: string
  conversion_ratio: string
  reason: string
  reverses: number | null
  reverses_name?: string | null
  employee_number: string
  entry_type_label: string
  signed_days: string
  source_label: string
  reversed_by_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RotationCreditsPayload = {
  id?: number
  is_active: boolean
  employee: number | null
  entry_type: string
  days: string
  effective_date: string
  source_type: string
  source_id: string
  plan: number | null
  segment: number | null
  reason: string
}