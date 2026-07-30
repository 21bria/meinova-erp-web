export type DepartmentRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  site: number | null
  site_name?: string | null
  division: number | null
  division_name?: string | null
  code: string
  name: string
  id: string
  company_name: string
  branch_name: string
  site_name: string
  division_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type DepartmentPayload = {
  id?: number
  is_active: boolean
  company: number | null
  branch: number | null
  site: number | null
  division: number | null
  code: string
  name: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}