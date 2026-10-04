import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LeaveBalancesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LeaveBalancesRow) => void
  onDelete?: (row: LeaveBalancesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLeaveBalancesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LeaveBalancesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LeaveBalancesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.leave-balances.fields.is_active", "Is active")),
      column.text("employee_name", resourceLabel("hr.leave-balances.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.leave-balances.fields.employee_number", "Employee No.")),
      column.text("leave_type_name", resourceLabel("hr.leave-balances.fields.leave_type", "Leave Type")),
      column.text("year", resourceLabel("hr.leave-balances.fields.year", "Year")),
      column.text("entitlement", resourceLabel("hr.leave-balances.fields.entitlement", "Entitlement")),
      column.text("carried_over", resourceLabel("hr.leave-balances.fields.carried_over", "Carried Over")),
      column.text("opening_balance", resourceLabel("hr.leave-balances.fields.opening_balance", "Opening Balance")),
      column.text("used", resourceLabel("hr.leave-balances.fields.used", "Used")),
      column.text("remaining", resourceLabel("hr.leave-balances.fields.remaining", "Remaining")),
    ],
  })
}