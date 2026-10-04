export type DistrictsRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  aid: string
  city: number | null
  city_name?: string | null
  city__province: number | null
  city__province_name?: string | null
  city_aid: string
  province_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type DistrictsPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  aid: string
  city: number | null
  city__province: number | null
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}