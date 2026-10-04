export type BpjsRulesRow = {
  id: number
  program: number | null
  program_name?: string | null
  company: number | null
  company_name?: string | null
  base_definition: number | null
  base_definition_name?: string | null
  risk_class: number | null
  risk_class_name?: string | null
  effective_from: string
  effective_to: string
  employee_rate: string
  employee_minimum_amount: string
  employee_maximum_amount: string
  reduces_taxable: boolean
  employer_rate: string
  employer_minimum_amount: string
  employer_maximum_amount: string
  base_minimum: string
  base_maximum: string
  description: string
  is_active: boolean
  scope_label: string
  base_definition_label: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type BpjsRulesPayload = {
  id?: number
  program: number | null
  company: number | null
  base_definition: number | null
  risk_class: number | null
  effective_from: string
  effective_to: string
  employee_rate: string
  employee_minimum_amount: string
  employee_maximum_amount: string
  reduces_taxable: boolean
  employer_rate: string
  employer_minimum_amount: string
  employer_maximum_amount: string
  base_minimum: string
  base_maximum: string
  description: string
  is_active: boolean
}