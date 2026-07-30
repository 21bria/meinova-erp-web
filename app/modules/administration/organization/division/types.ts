export type DivisionRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  site: number | null
  site_name?: string | null
  code: string
  name: string
  id: string
  company_name: string
  branch_name: string
  site_name: string
  created_at: string
  updated_at: string
}

export type DivisionPayload = {
  id?: number
  is_active: boolean
  company: number | null
  branch: number | null
  site: number | null
  code: string
  name: string
}