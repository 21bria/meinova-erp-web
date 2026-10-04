import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LeaveOpeningBalancesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LeaveOpeningBalancesRow) => void
  onDelete?: (row: LeaveOpeningBalancesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLeaveOpeningBalancesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LeaveOpeningBalancesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LeaveOpeningBalancesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.leave-opening-balances.fields.is_active", "Is active")),
      column.text("employee_name", resourceLabel("hr.leave-opening-balances.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.leave-opening-balances.fields.employee_number", "Employee No.")),
      column.date("join_date", resourceLabel("hr.leave-opening-balances.fields.join_date", "Join Date")),
      column.date("eligible_date", resourceLabel("hr.leave-opening-balances.fields.eligible_date", "Eligible Date")),
      column.text("leave_type_name", resourceLabel("hr.leave-opening-balances.fields.leave_type", "Leave Type")),
      column.date("opening_date", resourceLabel("hr.leave-opening-balances.fields.opening_date", "Opening Date")),
      column.text("year", resourceLabel("hr.leave-opening-balances.fields.year", "Balance Year")),
      column.text("days", resourceLabel("hr.leave-opening-balances.fields.days", "Opening Balance")),
      column.text("validation_label", resourceLabel("hr.leave-opening-balances.fields.validation_label", "Validation")),
      column.date("expires_at", resourceLabel("hr.leave-opening-balances.fields.expires_at", "Expires At")),
      column.text("source_label", resourceLabel("hr.leave-opening-balances.fields.source", "Source")),
      column.text("status_label", resourceLabel("hr.leave-opening-balances.fields.status", "Status")),
      column.text("posted_by_name", resourceLabel("hr.leave-opening-balances.fields.posted_by", "Posted by")),
    ],
  })
}