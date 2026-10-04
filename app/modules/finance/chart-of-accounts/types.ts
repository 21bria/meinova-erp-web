export type ChartOfAccountsRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  code: string
  name: string
  parent: number | null
  parent_name?: string | null
  account_type: string
  account_category: string
  normal_balance: string
  posting_allowed: boolean
  control_account: boolean
  reconciliation_required: boolean
  default_currency: number | null
  default_currency_name?: string | null
  sort_order: string
  metadata: string
  path: string
  level: string
  default_currency_code: string
  account_type_label: string
  account_category_label: string
  effective_normal_balance: string
  is_group: string
  has_entries: string
  can_delete: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
  description: string
}

export type ChartOfAccountsPayload = {
  id?: number
  is_active: boolean
  company: number | null
  code: string
  name: string
  parent: number | null
  account_type: string
  account_category: string
  normal_balance: string
  posting_allowed: boolean
  control_account: boolean
  reconciliation_required: boolean
  default_currency: number | null
  sort_order: string
  metadata: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
  description: string
}