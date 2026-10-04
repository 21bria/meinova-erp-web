export type BpjsBaseComponentsRow = {
  id: number
  is_active: boolean
  definition: number | null
  definition_name?: string | null
  allowance_code: string
  sequence: string
  definition_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BpjsBaseComponentsPayload = {
  id?: number
  is_active: boolean
  definition: number | null
  allowance_code: string
  sequence: string
}