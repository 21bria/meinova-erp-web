export type PrintSettingsRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  logo: string
  header_text: string
  footer_text: string
  default_paper_size: string
  default_orientation: string
  show_logo: boolean
  show_footer: boolean
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PrintSettingsPayload = {
  id?: number
  is_active: boolean
  company: number | null
  logo: string
  header_text: string
  footer_text: string
  default_paper_size: string
  default_orientation: string
  show_logo: boolean
  show_footer: boolean
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}