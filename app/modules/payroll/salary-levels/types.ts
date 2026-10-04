export type SalaryLevelsRow = {
  id: number
  salary_grade: number | null
  salary_grade_name?: string | null
  code: string
  name: string
  sequence: string
  minimum_salary: string
  maximum_salary: string
  is_active: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
  description: string
}

export type SalaryLevelsPayload = {
  id?: number
  salary_grade: number | null
  code: string
  name: string
  sequence: string
  minimum_salary: string
  maximum_salary: string
  is_active: boolean
  description: string
}