export type PayrollPeriodsRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  payroll_group: number | null
  payroll_group_name?: string | null
  code: string
  name: string
  start_date: string
  end_date: string
  cutoff_date: string
  payment_date: string
  status: string
  working_days: string
  locked_at: string
  locked_by: number | null
  locked_by_name?: string | null
  notes: string
  is_locked: boolean
  run_count: string
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

export type PayrollPeriodsPayload = {
  id?: number
  is_active: boolean
  company: number | null
  payroll_group: number | null
  code: string
  name: string
  start_date: string
  end_date: string
  cutoff_date: string
  payment_date: string
  working_days: string
  notes: string
}