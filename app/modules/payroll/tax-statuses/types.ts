export type TaxStatusesRow = {
  id: number
  code: string
  name: string
  description: string
  non_taxable_income: string
  is_active: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type TaxStatusesPayload = {
  id?: number
  code: string
  name: string
  description: string
  non_taxable_income: string
  is_active: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}