export type JournalsRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  journal_number: string
  fiscal_year: number | null
  fiscal_year_name?: string | null
  accounting_period: number | null
  accounting_period_name?: string | null
  journal_type: string
  source_module: string
  source_type: string
  source_id: string
  source_reference: string
  posting_date: string
  document_date: string
  currency: number | null
  currency_name?: string | null
  base_currency: number | null
  base_currency_name?: string | null
  exchange_rate: string
  description: string
  status: string
  total_debit: string
  total_credit: string
  base_total_debit: string
  base_total_credit: string
  reversal_of: number | null
  reversal_of_name?: string | null
  reversed_by: number | null
  reversed_by_name?: string | null
  submitted_at: string
  submitted_by: number | null
  submitted_by_name?: string | null
  approved_at: string
  approved_by: number | null
  approved_by_name?: string | null
  posted_at: string
  posted_by: number | null
  posted_by_name?: string | null
  reversed_at: string
  reversed_by_user: number | null
  reversed_by_user_name?: string | null
  cancelled_at: string
  cancelled_by: number | null
  cancelled_by_name?: string | null
  status_reason: string
  metadata: string
  currency_code: string
  base_currency_code: string
  fiscal_year_code: string
  accounting_period_code: string
  period_status: string
  status_label: string
  journal_type_label: string
  reversal_of_number: string
  reversed_by_number: string
  lines: string
  line_items: string
  is_balanced: string
  difference: string
  can_edit: string
  can_save: string
  can_delete: string
  can_post: string
  can_reverse: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type JournalsPayload = {
  id?: number
  is_active: boolean
  company: number | null
  journal_type: string
  source_module: string
  source_type: string
  source_id: string
  source_reference: string
  posting_date: string
  document_date: string
  currency: number | null
  exchange_rate: string
  description: string
  metadata: string
  line_items: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}