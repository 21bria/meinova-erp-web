import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AllowanceTemplateLinesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AllowanceTemplateLinesRow) => void
  onDelete?: (row: AllowanceTemplateLinesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAllowanceTemplateLinesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AllowanceTemplateLinesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AllowanceTemplateLinesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.allowance-template-lines.fields.is_active", "Active")),
      column.text("template_name", resourceLabel("payroll.allowance-template-lines.fields.template", "Allowance Template")),
      column.text("code", resourceLabel("payroll.allowance-template-lines.fields.code", "Component Code")),
      column.text("name", resourceLabel("payroll.allowance-template-lines.fields.name", "Component Name")),
      column.text("sequence", resourceLabel("payroll.allowance-template-lines.fields.sequence", "Sequence")),
      column.text("basis_label", resourceLabel("payroll.allowance-template-lines.fields.basis", "Calculation Basis")),
      column.text("amount", resourceLabel("payroll.allowance-template-lines.fields.amount", "Amount")),
      column.text("is_taxable_label", resourceLabel("payroll.allowance-template-lines.fields.is_taxable", "Taxable")),
      column.text("is_prorated_label", resourceLabel("payroll.allowance-template-lines.fields.is_prorated", "Prorated")),
    ],
  })
}