export type EmployeesRow = {
  id: number
  user: number | null
  user_name?: string | null
  employee_number: string
  nik: string
  passport_number: string
  tax_number: string
  first_name: string
  last_name: string
  gender: number | null
  gender_name?: string | null
  religion: number | null
  religion_name?: string | null
  nationality: number | null
  nationality_name?: string | null
  blood_type: number | null
  blood_type_name?: string | null
  marital_status: number | null
  marital_status_name?: string | null
  birth_place: string
  birth_date: string
  personal_email: string
  work_email: string
  phone: string
  mobile: string
  emergency_contact_phone: string
  emergency_contact_name: string
  avatar: string
  notes: string
  is_active: boolean
  id: string
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  site: number | null
  site_name?: string | null
  division: number | null
  division_name?: string | null
  department: number | null
  department_name?: string | null
  section: number | null
  section_name?: string | null
  position: number | null
  position_name?: string | null
  job_level: number | null
  job_level_name?: string | null
  job_grade: number | null
  job_grade_name?: string | null
  reports_to: number | null
  reports_to_name?: string | null
  cost_center: number | null
  cost_center_name?: string | null
  organization_effective_date: string
  organization_notes: string
  employment_status: number | null
  employment_status_name?: string | null
  employment_type: number | null
  employment_type_name?: string | null
  employee_group: number | null
  employee_group_name?: string | null
  contract_type: number | null
  contract_type_name?: string | null
  probation_type: number | null
  probation_type_name?: string | null
  employment_effective_date: string
  join_date: string
  confirmation_date: string
  probation_start: string
  probation_end: string
  contract_start: string
  contract_end: string
  work_schedule: number | null
  work_schedule_name?: string | null
  working_calendar: number | null
  working_calendar_name?: string | null
  shift: number | null
  shift_name?: string | null
  notice_period_days: number
  employment_notes: string
  payroll_group: number | null
  payroll_group_name?: string | null
  salary_grade: number | null
  salary_grade_name?: string | null
  salary_level: number | null
  salary_level_name?: string | null
  currency: number | null
  currency_name?: string | null
  payment_method: string
  tax_status: number | null
  tax_status_name?: string | null
  tax_number_payroll: string
  bpjs_kesehatan_number: string
  bpjs_ketenagakerjaan_number: string
  overtime_eligible: boolean
  overtime_group: number | null
  overtime_group_name?: string | null
  basic_salary: string
  allowance_template: number | null
  allowance_template_name?: string | null
  deduction_template: number | null
  deduction_template_name?: string | null
  effective_from: string
  effective_to: string
  payroll_notes: string
  full_name: string
  display_name: string
  project: number | null
  project_name?: string | null
}

export type EmployeesPayload = {
  id?: number
  user: number | null
  employee_number: string
  nik: string
  passport_number: string
  tax_number: string
  first_name: string
  last_name: string
  gender: number | null
  religion: number | null
  nationality: number | null
  blood_type: number | null
  marital_status: number | null
  birth_place: string
  birth_date: string
  personal_email: string
  work_email: string
  phone: string
  mobile: string
  emergency_contact_phone: string
  emergency_contact_name: string
  avatar: string
  notes: string
  is_active: boolean
  company: number | null
  branch: number | null
  site: number | null
  division: number | null
  department: number | null
  section: number | null
  position: number | null
  job_level: number | null
  job_grade: number | null
  reports_to: number | null
  cost_center: number | null
  organization_effective_date: string
  organization_notes: string
  employment_status: number | null
  employment_type: number | null
  employee_group: number | null
  contract_type: number | null
  probation_type: number | null
  employment_effective_date: string
  join_date: string
  confirmation_date: string
  probation_start: string
  probation_end: string
  contract_start: string
  contract_end: string
  work_schedule: number | null
  working_calendar: number | null
  shift: number | null
  notice_period_days: number
  employment_notes: string
  payroll_group: number | null
  salary_grade: number | null
  salary_level: number | null
  currency: number | null
  payment_method: string
  tax_status: number | null
  tax_number_payroll: string
  bpjs_kesehatan_number: string
  bpjs_ketenagakerjaan_number: string
  overtime_eligible: boolean
  overtime_group: number | null
  basic_salary: string
  allowance_template: number | null
  deduction_template: number | null
  effective_from: string
  effective_to: string
  payroll_notes: string
  project: number | null
}