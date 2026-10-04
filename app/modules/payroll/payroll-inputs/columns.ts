import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PayrollInputsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PayrollInputsRow) => void
  onDelete?: (row: PayrollInputsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPayrollInputsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PayrollInputsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PayrollInputsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.payroll-inputs.fields.is_active", "Is active")),
      column.text("period_name", resourceLabel("payroll.payroll-inputs.fields.period", "Payroll Period")),
      column.text("employee_name", resourceLabel("payroll.payroll-inputs.fields.employee", "Employee")),
      column.text("input_type", resourceLabel("payroll.payroll-inputs.fields.input_type", "Input Type")),
      column.text("component_type", resourceLabel("payroll.payroll-inputs.fields.component_type", "Side")),
      column.text("code", resourceLabel("payroll.payroll-inputs.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.payroll-inputs.fields.name", "Name")),
      column.text("quantity", resourceLabel("payroll.payroll-inputs.fields.quantity", "Quantity")),
      column.text("amount", resourceLabel("payroll.payroll-inputs.fields.amount", "Amount")),
      column.text("status", resourceLabel("payroll.payroll-inputs.fields.status", "Status")),
    ],
  })
}