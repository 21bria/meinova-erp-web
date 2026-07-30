export type BranchRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  code: string
  name: string
  country: number | null
  country_name?: string | null
  province: number | null
  province_name?: string | null
  city: number | null
  city_name?: string | null
  address: string
  postal_code: string
  phone: string
  email: string
  website: string
  id: string
  company_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BranchPayload = {
  id?: number
  is_active: boolean
  company: number | null
  code: string
  name: string
  country: number | null
  province: number | null
  city: number | null
  address: string
  postal_code: string
  phone: string
  email: string
  website: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}