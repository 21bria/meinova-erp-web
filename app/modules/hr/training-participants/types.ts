export type TrainingParticipantsRow = {
  id: number
  is_active: boolean
  program: number | null
  program_name?: string | null
  employee: number | null
  employee_name?: string | null
  status: string
  score: string
  is_passed: boolean
  certificate_number: string
  employee_training: number | null
  employee_training_name?: string | null
  notes: string
  program_code: string
  employee_number: string
  status_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type TrainingParticipantsPayload = {
  id?: number
  is_active: boolean
  program: number | null
  employee: number | null
  status: string
  score: string
  is_passed: boolean
  certificate_number: string
  employee_training: number | null
  notes: string
}