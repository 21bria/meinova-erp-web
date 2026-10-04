export type NotificationLogsRow = {
  id: number
  event: string
  recipient: number | null
  recipient_name?: string | null
  recipient_email: string
  channel: string
  status: string
  subject: string
  body: string
  action_url: string
  module: string
  object_type: string
  object_id: string
  dedup_key: string
  detail: string
  attempts: string
  sent_at: string
  event_label: string
  channel_label: string
  status_label: string
  created_at: string
}

export type NotificationLogsPayload = {
  id?: number
  event: string
  recipient: number | null
  recipient_email: string
  recipient_name: string
  channel: string
  status: string
  subject: string
  body: string
  action_url: string
  module: string
  object_type: string
  object_id: string
  dedup_key: string
  detail: string
  attempts: string
  sent_at: string
}