export type FacilityRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  facility_type: number | null
  facility_type_name?: string | null
  code: string
  name: string
  description: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type FacilityPayload = {
  id?: number
  is_active: boolean
  company: number | null
  branch: number | null
  location: number | null
  facility_type: number | null
  code: string
  name: string
  description: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}