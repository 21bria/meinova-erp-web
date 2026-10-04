export type LeaveGoLiveRow = {
  id: number
  company: number | null
  company_name?: string | null
  go_live_date: string
  is_active: boolean
  notes: string
  cutoff_date: string
  draft_count: string
  posted_count: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type LeaveGoLivePayload = {
  id?: number
  company: number | null
  go_live_date: string
  is_active: boolean
  notes: string
}