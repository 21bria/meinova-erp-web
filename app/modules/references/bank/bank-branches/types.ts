export type BankBranchesRow = {
  id: number
  is_active: boolean
  code: string
  name: string
  branch_code: string
  address: string
  phone: string
  email: string
  contact_person: string
  is_head_office: boolean
  bank: number | null
  bank_name?: string | null
  city: number | null
  city_name?: string | null
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
  swift_code: string
}

export type BankBranchesPayload = {
  id?: number
  is_active: boolean
  code: string
  name: string
  branch_code: string
  address: string
  phone: string
  email: string
  contact_person: string
  is_head_office: boolean
  bank: number | null
  city: number | null
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
  swift_code: string
}