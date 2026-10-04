export type PayrollInputsRow = {
  id: number
  is_active: boolean
  period: number | null
  period_name?: string | null
  employee: number | null
  employee_name?: string | null
  input_type: string
  component_type: string
  allowance_line: number | null
  allowance_line_name?: string | null
  deduction_line: number | null
  deduction_line_name?: string | null
  code: string
  name: string
  quantity: string
  rate: string
  amount: string
  is_taxable: boolean
  status: string
  reference: string
  notes: string
  employee_number: string
  effective_side: string
  effective_code: string
  effective_name: string
  effective_amount: string
  can_edit: string
  can_save: string
  can_delete: string
  created_at: string
  updated_at: string
  is_deleted: string
  deleted_at: string
  created_by: string
  updated_by: string
  deleted_by: string
}

export type PayrollInputsPayload = {
  id?: number
  is_active: boolean
  period: number | null
  employee: number | null
  input_type: string
  component_type: string
  allowance_line: number | null
  deduction_line: number | null
  code: string
  name: string
  quantity: string
  rate: string
  amount: string
  is_taxable: boolean
  status: string
  reference: string
  notes: string
}