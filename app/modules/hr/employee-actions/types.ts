export type EmployeeActionsRow = {
  id: number
  is_active: boolean
  document_number: string
  employee: number | null
  employee_name?: string | null
  requested_by: number | null
  requested_by_name?: string | null
  action_type: string
  status: string
  effective_date: string
  reason: string
  notes: string
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  proposed_employment_type: number | null
  proposed_employment_type_name?: string | null
  proposed_employment_status: number | null
  proposed_employment_status_name?: string | null
  proposed_employee_group: number | null
  proposed_employee_group_name?: string | null
  confirmation_date: string
  proposed_contract_type: number | null
  proposed_contract_type_name?: string | null
  proposed_contract_start: string
  proposed_contract_end: string
  proposed_probation_type: number | null
  proposed_probation_type_name?: string | null
  proposed_probation_start: string
  proposed_probation_end: string
  proposed_company: number | null
  proposed_company_name?: string | null
  proposed_branch: number | null
  proposed_branch_name?: string | null
  proposed_location: number | null
  proposed_location_name?: string | null
  proposed_division: number | null
  proposed_division_name?: string | null
  proposed_department: number | null
  proposed_department_name?: string | null
  proposed_section: number | null
  proposed_section_name?: string | null
  proposed_position: number | null
  proposed_position_name?: string | null
  proposed_job_level: number | null
  proposed_job_level_name?: string | null
  proposed_job_grade: number | null
  proposed_job_grade_name?: string | null
  proposed_cost_center: number | null
  proposed_cost_center_name?: string | null
  proposed_reports_to: number | null
  proposed_reports_to_name?: string | null
  proposed_payroll_group: number | null
  proposed_payroll_group_name?: string | null
  proposed_salary_grade: number | null
  proposed_salary_grade_name?: string | null
  proposed_salary_level: number | null
  proposed_salary_level_name?: string | null
  proposed_basic_salary: string
  termination_reason: number | null
  termination_reason_name?: string | null
  last_working_date: string
  values_before: string
  values_after: string
  applied_at: string
  applied_by: number | null
  applied_by_name?: string | null
  apply_error: string
  employee_number: string
  action_type_label: string
  status_label: string
  is_editable: string
  is_applied: string
  current_employment_type_name: string
  current_employment_status_name: string
  current_employee_group_name: string
  current_contract_type_name: string
  current_contract_start: string
  current_contract_end: string
  current_probation_type_name: string
  current_probation_start: string
  current_probation_end: string
  current_position_name: string
  current_department_name: string
  current_section_name: string
  current_location_name: string
  current_basic_salary: string
  workflow: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type EmployeeActionsPayload = {
  id?: number
  is_active: boolean
  employee: number | null
  requested_by: number | null
  action_type: string
  effective_date: string
  reason: string
  notes: string
  proposed_employment_type: number | null
  proposed_employment_status: number | null
  proposed_employee_group: number | null
  confirmation_date: string
  proposed_contract_type: number | null
  proposed_contract_start: string
  proposed_contract_end: string
  proposed_probation_type: number | null
  proposed_probation_start: string
  proposed_probation_end: string
  proposed_company: number | null
  proposed_branch: number | null
  proposed_location: number | null
  proposed_division: number | null
  proposed_department: number | null
  proposed_section: number | null
  proposed_position: number | null
  proposed_job_level: number | null
  proposed_job_grade: number | null
  proposed_cost_center: number | null
  proposed_reports_to: number | null
  proposed_payroll_group: number | null
  proposed_salary_grade: number | null
  proposed_salary_level: number | null
  proposed_basic_salary: string
  termination_reason: number | null
  last_working_date: string
}