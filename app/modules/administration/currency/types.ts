export type CurrencyRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  symbol: string
  decimal_places: string
  is_base_currency: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type CurrencyPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  symbol: string
  decimal_places: string
  is_base_currency: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}