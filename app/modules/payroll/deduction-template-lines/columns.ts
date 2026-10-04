import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { DeductionTemplateLinesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DeductionTemplateLinesRow) => void
  onDelete?: (row: DeductionTemplateLinesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDeductionTemplateLinesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DeductionTemplateLinesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DeductionTemplateLinesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.deduction-template-lines.fields.is_active", "Active")),
      column.text("template_name", resourceLabel("payroll.deduction-template-lines.fields.template", "Deduction Template")),
      column.text("code", resourceLabel("payroll.deduction-template-lines.fields.code", "Component Code")),
      column.text("name", resourceLabel("payroll.deduction-template-lines.fields.name", "Component Name")),
      column.text("sequence", resourceLabel("payroll.deduction-template-lines.fields.sequence", "Sequence")),
      column.text("basis", resourceLabel("payroll.deduction-template-lines.fields.basis", "Calculation Basis")),
      column.text("amount", resourceLabel("payroll.deduction-template-lines.fields.amount", "Amount")),
      column.status("reduces_taxable", resourceLabel("payroll.deduction-template-lines.fields.reduces_taxable", "Reduces Taxable Income")),
      column.status("is_employer_cost", resourceLabel("payroll.deduction-template-lines.fields.is_employer_cost", "Employer Cost")),
    ],
  })
}