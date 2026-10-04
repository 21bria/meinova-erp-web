export type TaxBracketsRow = {
  id: number
  is_active: boolean
  sequence: string
  income_from: string
  income_to: string
  rate: string
  description: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type TaxBracketsPayload = {
  id?: number
  is_active: boolean
  sequence: string
  income_from: string
  income_to: string
  rate: string
  description: string
}