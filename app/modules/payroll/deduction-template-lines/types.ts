export type DeductionTemplateLinesRow = {
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
  minimum_base: string
  maximum_base: string
  minimum_amount: string
  maximum_amount: string
  reduces_taxable: boolean
  is_employer_cost: boolean
  is_prorated: boolean
  description: string
  template_code: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type DeductionTemplateLinesPayload = {
  id?: number
  is_active: boolean
  template: number | null
  code: string
  name: string
  sequence: string
  basis: string
  amount: string
  rate: string
  minimum_base: string
  maximum_base: string
  minimum_amount: string
  maximum_amount: string
  reduces_taxable: boolean
  is_employer_cost: boolean
  is_prorated: boolean
  description: string
}