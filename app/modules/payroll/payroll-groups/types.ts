export type PayrollGroupsRow = {
  id: number
  code: string
  name: string
  description: string
  pay_frequency: string
  is_active: boolean
  id: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PayrollGroupsPayload = {
  id?: number
  code: string
  name: string
  description: string
  pay_frequency: string
  is_active: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}