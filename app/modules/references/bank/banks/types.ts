export type BanksRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  short_name: string
  swift_code: string
  country: number | null
  country_name?: string | null
  id: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
  description: string
}

export type BanksPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  short_name: string
  swift_code: string
  country: number | null
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
  description: string
}