export type DivisionRow = {
  id: number
  is_active: boolean
  company: number | null
  company_name?: string | null
  branch: number | null
  branch_name?: string | null
  location: number | null
  location_name?: string | null
  code: string
  name: string
  created_at: string
  updated_at: string
}

export type DivisionPayload = {
  id?: number
  is_active: boolean
  company: number | null
  branch: number | null
  location: number | null
  code: string
  name: string
}