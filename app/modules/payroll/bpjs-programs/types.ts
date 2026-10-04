export type BpjsProgramsRow = {
  id: number
  code: string
  name: string
  description: string
  sequence: string
  uses_risk_class: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BpjsProgramsPayload = {
  id?: number
  code: string
  name: string
  description: string
  sequence: string
  uses_risk_class: boolean
  is_active: boolean
}