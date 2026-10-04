export type AccountingPeriodsRow = {
  id: number
  is_active: boolean
  fiscal_year: number | null
  fiscal_year_name?: string | null
  period_number: string
  code: string
  name: string
  start_date: string
  end_date: string
  status: string
  closed_at: string
  closed_by: number | null
  closed_by_name?: string | null
  reopened_at: string
  reopened_by: number | null
  reopened_by_name?: string | null
  reopen_reason: string
  fiscal_year_code: string
  company: string
  company_name: string
  status_label: string
  allowed_transitions: string
  has_posted_journals: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AccountingPeriodsPayload = {
  id?: number
  is_active: boolean
  fiscal_year: number | null
  period_number: string
  code: string
  name: string
  start_date: string
  end_date: string
  status: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}