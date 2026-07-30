export type PositionRow = {
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
  department: number | null
  department_name?: string | null
  section: number | null
  section_name?: string | null
  job_category: number | null
  job_category_name?: string | null
  job_level: number | null
  job_level_name?: string | null
  reports_to: number | null
  reports_to_name?: string | null
  code: string
  name: string
  headcount: string
  description: string
  is_manager: boolean
  id: string
  company_name: string
  branch_name: string
  site_name: string
  division_name: string
  department_name: string
  section_name: string
  job_category_name: string
  job_level_name: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PositionPayload = {
  id?: number
  is_active: boolean
  company: number | null
  branch: number | null
  site: number | null
  division: number | null
  department: number | null
  section: number | null
  job_category: number | null
  job_level: number | null
  reports_to: number | null
  code: string
  name: string
  headcount: string
  description: string
  is_manager: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}