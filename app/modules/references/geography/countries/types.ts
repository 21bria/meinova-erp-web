export type CountriesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  phone_code: string
  currency_code: string
  id: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type CountriesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  phone_code: string
  currency_code: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}