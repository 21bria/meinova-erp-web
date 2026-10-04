import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PayrollSettingsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PayrollSettingsRow) => void
  onDelete?: (row: PayrollSettingsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPayrollSettingsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PayrollSettingsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PayrollSettingsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("payroll.payroll-settings.fields.company", "Company")),
      column.text("proration_method_label", resourceLabel("payroll.payroll-settings.fields.proration_method", "Salary Proration Method")),
      column.status("prorate_on_join", resourceLabel("payroll.payroll-settings.fields.prorate_on_join", "Prorate New Joiners")),
      column.status("prorate_on_termination", resourceLabel("payroll.payroll-settings.fields.prorate_on_termination", "Prorate Leavers")),
      column.text("attendance_deduction_method_label", resourceLabel("payroll.payroll-settings.fields.attendance_deduction_method", "Attendance Deduction Method")),
      column.status("deduct_absence", resourceLabel("payroll.payroll-settings.fields.deduct_absence", "Deduct Absence")),
      column.status("deduct_unpaid_leave", resourceLabel("payroll.payroll-settings.fields.deduct_unpaid_leave", "Deduct Unpaid Leave")),
      column.status("is_active", resourceLabel("payroll.payroll-settings.fields.is_active", "Active")),
    ],
  })
}