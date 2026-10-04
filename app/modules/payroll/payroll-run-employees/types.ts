export type PayrollRunEmployeesRow = {
  id: number
  is_active: boolean
  run: number | null
  run_name?: string | null
  employee: number | null
  employee_name?: string | null
  payroll_assignment: number | null
  payroll_assignment_name?: string | null
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
  section: number | null
  section_name?: string | null
  cost_center: number | null
  cost_center_name?: string | null
  position: number | null
  position_name?: string | null
  payroll_group: number | null
  payroll_group_name?: string | null
  salary_grade: number | null
  salary_grade_name?: string | null
  salary_level: number | null
  salary_level_name?: string | null
  tax_status: number | null
  tax_status_name?: string | null
  overtime_group: number | null
  overtime_group_name?: string | null
  allowance_template: number | null
  allowance_template_name?: string | null
  deduction_template: number | null
  deduction_template_name?: string | null
  payroll_policy: number | null
  payroll_policy_name?: string | null
  pay_basis: string
  daily_rate: string
  currency: number | null
  currency_name?: string | null
  payment_method: string
  join_date: string
  termination_date: string
  basic_salary: string
  period_days: string
  working_days: string
  paid_days: string
  attendance_days: string
  absent_days: string
  leave_days: string
  unpaid_leave_days: string
  overtime_hours: string
  proration_method: string
  proration_base_days: string
  proration_factor: string
  attendance_deduction_method: string
  deduction_base_days: string
  absence_deduction: string
  unpaid_leave_deduction: string
  gross_earning: string
  taxable_earning: string
  total_deduction: string
  tax_amount: string
  net_pay: string
  employer_contribution: string
  status: string
  is_excluded: boolean
  exclusion_reason: string
  findings: string
  snapshot: string
  notes: string
  employee_number: string
  run_document_number: string
  period_name: string
  payroll_policy_label: string
  components: string
  proration_method_label: string
  attendance_deduction_method_label: string
  paid_leave_days: string
  components_summary: string
  can_edit: string
  can_save: string
  can_delete: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PayrollRunEmployeesPayload = {
  id?: number
  is_excluded: boolean
  exclusion_reason: string
  notes: string
}