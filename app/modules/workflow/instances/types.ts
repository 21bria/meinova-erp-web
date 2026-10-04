export type InstancesRow = {
  id: number
  definition: number | null
  definition_name?: string | null
  module: string
  document_type: string
  object_id: string
  document_number: string
  document_label: string
  subject_employee: number | null
  subject_employee_name?: string | null
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  status: string
  current_step: number | null
  current_step_name?: string | null
  submitted_by: number | null
  submitted_by_name?: string | null
  submitted_at: string
  completed_at: string
  notes: string
  context: string
  definition_code: string
  status_label: string
  subject_name: string
  subject_number: string
  approvals: string
  progress: string
  waiting_for: string
  document_url: string
  can_act: string
  created_at: string
  updated_at: string
}

export type InstancesPayload = {
  id?: number
}