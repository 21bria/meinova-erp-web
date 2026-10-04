import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PayrollPeriodsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PayrollPeriodsRow) => void
  onDelete?: (row: PayrollPeriodsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPayrollPeriodsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PayrollPeriodsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PayrollPeriodsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.payroll-periods.fields.is_active", "Is active")),
      column.text("company_name", resourceLabel("payroll.payroll-periods.fields.company", "Company")),
      column.text("payroll_group_name", resourceLabel("payroll.payroll-periods.fields.payroll_group", "Payroll Group")),
      column.text("code", resourceLabel("payroll.payroll-periods.fields.code", "Period Code")),
      column.text("name", resourceLabel("payroll.payroll-periods.fields.name", "Period Name")),
      column.date("start_date", resourceLabel("payroll.payroll-periods.fields.start_date", "Start Date")),
      column.date("end_date", resourceLabel("payroll.payroll-periods.fields.end_date", "End Date")),
      column.date("payment_date", resourceLabel("payroll.payroll-periods.fields.payment_date", "Payment Date")),
      column.text("status", resourceLabel("payroll.payroll-periods.fields.status", "Status")),
      column.datetime("locked_at", resourceLabel("payroll.payroll-periods.fields.locked_at", "Locked at")),
      column.text("locked_by_name", resourceLabel("payroll.payroll-periods.fields.locked_by", "Locked by")),
      column.text("run_count", resourceLabel("payroll.payroll-periods.fields.run_count", "Runs")),

    ],
  })
}