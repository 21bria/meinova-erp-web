export type NotificationRulesRow = {
  id: number
  is_active: boolean
  event: string
  company: number | null
  company_name?: string | null
  recipient_type: string
  role: number | null
  role_name?: string | null
  user: number | null
  user_name?: string | null
  manager_level: string
  send_in_app: boolean
  send_email: boolean
  sort_order: string
  event_label: string
  recipient_type_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type NotificationRulesPayload = {
  id?: number
  is_active: boolean
  event: string
  company: number | null
  recipient_type: string
  role: number | null
  user: number | null
  manager_level: string
  send_in_app: boolean
  send_email: boolean
  sort_order: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}