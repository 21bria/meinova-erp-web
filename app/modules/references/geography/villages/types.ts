export type VillagesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  aid: string
  district: number | null
  district_name?: string | null
  district__city: number | null
  district__city_name?: string | null
  district_aid: string
  city_name: string
  province_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type VillagesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  aid: string
  district: number | null
  district__city: number | null
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}