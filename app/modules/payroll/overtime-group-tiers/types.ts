export type OvertimeGroupTiersRow = {
  id: number
  group: number | null
  group_name?: string | null
  sequence: string
  hour_from: string
  hour_to: string
  multiplier: string
  description: string
  is_active: boolean
  group_code: string
  hour_range_label: string
  multiplier_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type OvertimeGroupTiersPayload = {
  id?: number
  group: number | null
  sequence: string
  hour_from: string
  hour_to: string
  multiplier: string
  description: string
  is_active: boolean
}