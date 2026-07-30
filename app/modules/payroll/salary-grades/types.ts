export type SalaryGradesRow = {
  id: number
  code: string
  name: string
  description: string
  minimum_salary: string
  maximum_salary: string
  is_active: boolean
  id: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type SalaryGradesPayload = {
  id?: number
  code: string
  name: string
  description: string
  minimum_salary: string
  maximum_salary: string
  is_active: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}