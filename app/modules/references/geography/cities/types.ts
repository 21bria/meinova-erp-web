export type CitiesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  aid: string
  province: number | null
  province_name?: string | null
  province_aid: string
  country_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type CitiesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  aid: string
  province: number | null
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}