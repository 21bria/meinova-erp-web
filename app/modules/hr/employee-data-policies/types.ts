export type EmployeeDataPoliciesRow = {
  id: number
  company: number | null
  company_name?: string | null
  location: number | null
  location_name?: string | null
  employee_group: number | null
  employee_group_name?: string | null
  subject: string
  code: string
  name: string
  description: string
  allow_self: boolean
  allow_manager: boolean
  manager_levels: string
  allow_department_head: boolean
  role: number | null
  role_name?: string | null
  is_active: boolean
  sort_order: string
  subject_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type EmployeeDataPoliciesPayload = {
  id?: number
  company: number | null
  location: number | null
  employee_group: number | null
  subject: string
  code: string
  name: string
  description: string
  allow_self: boolean
  allow_manager: boolean
  manager_levels: string
  allow_department_head: boolean
  role: number | null
  is_active: boolean
  sort_order: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}