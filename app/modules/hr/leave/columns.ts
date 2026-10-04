import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LeaveRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LeaveRow) => void
  onDelete?: (row: LeaveRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLeaveColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LeaveRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LeaveRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.leave.fields.is_active", "Is active")),
      column.text("document_number", resourceLabel("hr.leave.fields.document_number", "Document No.")),
      column.text("employee_name", resourceLabel("hr.leave.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.leave.fields.employee_number", "Employee No.")),
      column.text("leave_type_name", resourceLabel("hr.leave.fields.leave_type", "Leave Type")),
      column.date("start_date", resourceLabel("hr.leave.fields.start_date", "Start Date")),
      column.date("end_date", resourceLabel("hr.leave.fields.end_date", "End Date")),
      column.text("total_days", resourceLabel("hr.leave.fields.total_days", "Total Days")),
      column.text("status_label", resourceLabel("hr.leave.fields.status", "Status")),

    ],
  })
}