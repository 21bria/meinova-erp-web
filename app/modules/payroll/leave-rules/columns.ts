import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LeaveRulesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LeaveRulesRow) => void
  onDelete?: (row: LeaveRulesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLeaveRulesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LeaveRulesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LeaveRulesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("payroll.leave-rules.fields.is_active", "Active")),
      column.text("leave_type_name", resourceLabel("payroll.leave-rules.fields.leave_type", "Leave Type")),
      column.status("is_unpaid", resourceLabel("payroll.leave-rules.fields.is_unpaid", "Unpaid Leave")),
    ],
  })
}