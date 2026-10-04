export type AllowanceTemplateLinesRow = {
  id: number
  is_active: boolean
  template: number | null
  template_name?: string | null
  code: string
  name: string
  sequence: string
  basis: string
  amount: string
  rate: string
  minimum_amount: string
  maximum_amount: string
  is_taxable: boolean
  is_prorated: boolean
  description: string
  template_code: string
  basis_label: string
  is_taxable_label: string
  is_prorated_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type AllowanceTemplateLinesPayload = {
  id?: number
  is_active: boolean
  template: number | null
  code: string
  name: string
  sequence: string
  basis: string
  amount: string
  rate: string
  minimum_amount: string
  maximum_amount: string
  is_taxable: boolean
  is_prorated: boolean
  description: string
}