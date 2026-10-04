export type RecruitmentRow = {
  id: number
  is_active: boolean
  code: string
  title: string
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
  position: number | null
  position_name?: string | null
  employment_type: number | null
  employment_type_name?: string | null
  quota: string
  open_date: string
  close_date: string
  status: string
  description: string
  requirements: string
  status_label: string
  candidate_count: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type RecruitmentPayload = {
  id?: number
  is_active: boolean
  code: string
  title: string
  company: number | null
  branch: number | null
  location: number | null
  division: number | null
  department: number | null
  position: number | null
  employment_type: number | null
  quota: string
  open_date: string
  close_date: string
  status: string
  description: string
  requirements: string
}