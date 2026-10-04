export type BpjsRiskClassesRow = {
  id: number
  code: string
  name: string
  description: string
  sequence: string
  is_active: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BpjsRiskClassesPayload = {
  id?: number
  code: string
  name: string
  description: string
  sequence: string
  is_active: boolean
}