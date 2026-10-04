import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BpjsRulesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BpjsRulesRow) => void
  onDelete?: (row: BpjsRulesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBpjsRulesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BpjsRulesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BpjsRulesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("program_name", resourceLabel("payroll.bpjs-rules.fields.program", "Program")),
      column.text("base_definition_label", resourceLabel("payroll.bpjs-rules.fields.base_definition", "Contribution Base")),
      column.text("risk_class_name", resourceLabel("payroll.bpjs-rules.fields.risk_class", "Risk Class")),
      column.date("effective_from", resourceLabel("payroll.bpjs-rules.fields.effective_from", "Effective From")),
      column.date("effective_to", resourceLabel("payroll.bpjs-rules.fields.effective_to", "Effective To")),
      column.text("employee_rate", resourceLabel("payroll.bpjs-rules.fields.employee_rate", "Employee Rate (%)")),
      column.status("reduces_taxable", resourceLabel("payroll.bpjs-rules.fields.reduces_taxable", "Reduces Taxable Income")),
      column.text("employer_rate", resourceLabel("payroll.bpjs-rules.fields.employer_rate", "Employer Rate (%)")),
      column.status("is_active", resourceLabel("payroll.bpjs-rules.fields.is_active", "Active")),
      column.text("scope_label", resourceLabel("payroll.bpjs-rules.fields.scope_label", "Applies To")),
    ],
  })
}