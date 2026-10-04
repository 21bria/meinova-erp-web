export type TenantSettingsRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  currency: number | null
  currency_name?: string | null
  timezone: string
  language: string
  date_format: string
  decimal_separator: string
  thousand_separator: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type TenantSettingsPayload = {
  id?: number
  is_active: boolean
  company: number | null
  currency: number | null
  timezone: string
  language: string
  date_format: string
  decimal_separator: string
  thousand_separator: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}