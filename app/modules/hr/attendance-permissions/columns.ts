import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AttendancePermissionsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AttendancePermissionsRow) => void
  onDelete?: (row: AttendancePermissionsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAttendancePermissionsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AttendancePermissionsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AttendancePermissionsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("hr.attendance-permissions.fields.is_active", "Is active")),
      column.text("document_number", resourceLabel("hr.attendance-permissions.fields.document_number", "Document No.")),
      column.text("employee_name", resourceLabel("hr.attendance-permissions.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.attendance-permissions.fields.employee_number", "Employee No.")),
      column.text("location_name", resourceLabel("hr.attendance-permissions.fields.location", "Location")),
      column.text("permission_type_label", resourceLabel("hr.attendance-permissions.fields.permission_type", "Permission Type")),
      column.date("date", resourceLabel("hr.attendance-permissions.fields.date", "Date")),
      column.text("time_window", resourceLabel("hr.attendance-permissions.fields.time_window", "Time")),
      column.text("reason", resourceLabel("hr.attendance-permissions.fields.reason", "Reason")),
      column.text("status_label", resourceLabel("hr.attendance-permissions.fields.status", "Status")),
      column.text("duration_minutes", resourceLabel("hr.attendance-permissions.fields.duration_minutes", "Duration (min)")),
      column.text("current_approver", resourceLabel("hr.attendance-permissions.fields.current_approver", "Current Approver")),

    ],
  })
}