export type FiscalYearsRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  code: string
  name: string
  start_date: string
  end_date: string
  status: string
  is_current: boolean
  closed_at: string
  closed_by: number | null
  closed_by_name?: string | null
  status_label: string
  period_count: string
  can_generate_periods: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type FiscalYearsPayload = {
  id?: number
  is_active: boolean
  company: number | null
  code: string
  name: string
  start_date: string
  end_date: string
  status: string
  is_current: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}