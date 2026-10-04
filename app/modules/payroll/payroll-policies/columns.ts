import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PayrollPoliciesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PayrollPoliciesRow) => void
  onDelete?: (row: PayrollPoliciesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPayrollPoliciesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PayrollPoliciesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PayrollPoliciesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("payroll.payroll-policies.fields.company", "Company")),
      column.text("code", resourceLabel("payroll.payroll-policies.fields.code", "Code")),
      column.text("name", resourceLabel("payroll.payroll-policies.fields.name", "Name")),
      column.text("pay_basis_label", resourceLabel("payroll.payroll-policies.fields.pay_basis", "Pay Basis")),
      column.text("proration_method_label", resourceLabel("payroll.payroll-policies.fields.proration_method", "Monthly - Salary Proration Method")),
      column.text("attendance_deduction_method_label", resourceLabel("payroll.payroll-policies.fields.attendance_deduction_method", "Monthly - Absence Deduction Method")),
      column.text("daily_rate_method_label", resourceLabel("payroll.payroll-policies.fields.daily_rate_method", "Daily - Daily Rate Method")),
      column.text("pay_paid_leave_label", resourceLabel("payroll.payroll-policies.fields.pay_paid_leave", "Daily - Approved Leave Days")),
      column.status("is_active", resourceLabel("payroll.payroll-policies.fields.is_active", "Active")),
    ],
  })
}