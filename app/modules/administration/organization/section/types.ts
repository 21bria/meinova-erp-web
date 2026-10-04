export type SectionRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  division: number | null
  division_name?: string | null
  department: number | null
  department_name?: string | null
  code: string
  name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type SectionPayload = {
  id?: number
  is_active: boolean
  company: number | null
  branch: number | null
  location: number | null
  division: number | null
  department: number | null
  code: string
  name: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}