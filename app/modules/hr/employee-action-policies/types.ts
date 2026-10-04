export type EmployeeActionPoliciesRow = {
  id: number
  company: number | null
  company_name?: string | null
  location: number | null
  location_name?: string | null
  employee_group: number | null
  employee_group_name?: string | null
  action_type: string
  code: string
  name: string
  description: string
  initiator_type: string
  initiator_role: number | null
  initiator_role_name?: string | null
  allow_on_behalf: boolean
  on_behalf_role: number | null
  on_behalf_role_name?: string | null
  is_active: boolean
  sort_order: string
  action_type_label: string
  initiator_type_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type EmployeeActionPoliciesPayload = {
  id?: number
  company: number | null
  location: number | null
  employee_group: number | null
  action_type: string
  code: string
  name: string
  description: string
  initiator_type: string
  initiator_role: number | null
  allow_on_behalf: boolean
  on_behalf_role: number | null
  is_active: boolean
  sort_order: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}