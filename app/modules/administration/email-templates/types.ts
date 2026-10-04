export type EmailTemplatesRow = {
  id: number
  is_active: boolean
  event: string
  company: number | null
  company_name?: string | null
  name: string
  subject: string
  body: string
  in_app_title: string
  in_app_body: string
  event_label: string
  unknown_placeholders: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type EmailTemplatesPayload = {
  id?: number
  is_active: boolean
  event: string
  company: number | null
  name: string
  subject: string
  body: string
  in_app_title: string
  in_app_body: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}