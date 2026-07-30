export type SiteRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  code: string
  name: string
  site_type: number | null
  site_type_name?: string | null
  country: number | null
  country_name?: string | null
  province: number | null
  province_name?: string | null
  city: number | null
  city_name?: string | null
  address: string
  postal_code: string
  id: string
  company_name: string
  branch_name: string
  site_type_name: string
  country_name: string
  province_name: string
  city_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type SitePayload = {
  id?: number
  is_active: boolean
  company: number | null
  branch: number | null
  code: string
  name: string
  site_type: number | null
  country: number | null
  province: number | null
  city: number | null
  address: string
  postal_code: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}