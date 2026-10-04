import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { OvertimeRow } from "./types"

type ColumnActions = {
  onEdit?: (row: OvertimeRow) => void
  onDelete?: (row: OvertimeRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getOvertimeColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<OvertimeRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<OvertimeRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.overtime.fields.is_active", "Is active")),
      column.text("employee_name", resourceLabel("hr.overtime.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.overtime.fields.employee_number", "Employee No.")),
      column.text("overtime_type_name", resourceLabel("hr.overtime.fields.overtime_type", "Overtime Type")),
      column.date("work_date", resourceLabel("hr.overtime.fields.work_date", "Work Date")),
      column.text("start_time", resourceLabel("hr.overtime.fields.start_time", "Start Time")),
      column.text("end_time", resourceLabel("hr.overtime.fields.end_time", "End Time")),
      column.text("duration_minutes", resourceLabel("hr.overtime.fields.duration_minutes", "Duration (minutes)")),
      column.text("status_label", resourceLabel("hr.overtime.fields.status", "Status")),
      column.status("is_paid", resourceLabel("hr.overtime.fields.is_paid", "Paid")),
      column.text("reason", resourceLabel("hr.overtime.fields.reason", "Reason")),
      column.text("duration_hours", resourceLabel("hr.overtime.fields.duration_hours", "Duration (hours)")),

    ],
  })
}