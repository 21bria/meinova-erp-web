export type AccountingPolicyRulesRow = {
  id: number
  is_active: boolean
  policy: number | null
  policy_name?: string | null
  sequence: string
  name: string
  conditions: string
  iterate_over: string
  stop_on_match: boolean
  line_count: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AccountingPolicyRulesPayload = {
  id?: number
  is_active: boolean
  policy: number | null
  sequence: string
  name: string
  conditions: string
  iterate_over: string
  stop_on_match: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}