export type TrainingRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  training_category: number | null
  training_category_name?: string | null
  provider: number | null
  provider_name?: string | null
  company: number | null
  company_name?: string | null
  start_date: string
  end_date: string
  duration_hours: string
  venue: string
  quota: string
  cost: string
  currency: number | null
  currency_name?: string | null
  status: string
  is_mandatory: boolean
  description: string
  currency_code: string
  status_label: string
  participant_count: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type TrainingPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  training_category: number | null
  provider: number | null
  company: number | null
  start_date: string
  end_date: string
  duration_hours: string
  venue: string
  quota: string
  cost: string
  currency: number | null
  status: string
  is_mandatory: boolean
  description: string
}