export type CandidatesRow = {
  id: number
  is_active: boolean
  candidate_number: string
  vacancy: number | null
  vacancy_name?: string | null
  full_name: string
  email: string
  phone: string
  gender: number | null
  gender_name?: string | null
  birth_date: string
  education: number | null
  education_name?: string | null
  source: number | null
  source_name?: string | null
  status: number | null
  status_name?: string | null
  applied_date: string
  expected_salary: string
  currency: number | null
  currency_name?: string | null
  rejection_reason: number | null
  rejection_reason_name?: string | null
  resume_file: string
  hired_employee: number | null
  hired_employee_name?: string | null
  hired_date: string
  notes: string
  vacancy_code: string
  vacancy_title: string
  currency_code: string
  resume_file_detail: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type CandidatesPayload = {
  id?: number
  is_active: boolean
  candidate_number: string
  vacancy: number | null
  full_name: string
  email: string
  phone: string
  gender: number | null
  birth_date: string
  education: number | null
  source: number | null
  status: number | null
  applied_date: string
  expected_salary: string
  currency: number | null
  rejection_reason: number | null
  resume_file: string
  hired_employee: number | null
  hired_date: string
  notes: string
}