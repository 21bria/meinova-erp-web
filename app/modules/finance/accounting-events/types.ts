export type AccountingEventsRow = {
  id: number
  is_active: boolean
  event_type: string
  source_module: string
  source_type: string
  source_id: string
  source_reference: string
  company: number | null
  company_name?: string | null
  event_date: string
  payload: string
  idempotency_key: string
  status: string
  processed_at: string
  generated_journal: number | null
  generated_journal_name?: string | null
  applied_policy: number | null
  applied_policy_name?: string | null
  attempts: string
  error_message: string
  status_label: string
  journal_number: string
  policy_code: string
  can_retry: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AccountingEventsPayload = {
  id?: number
}