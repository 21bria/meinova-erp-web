import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AttendanceRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AttendanceRow) => void
  onDelete?: (row: AttendanceRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAttendanceColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AttendanceRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
   role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AttendanceRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("employee_name", resourceLabel("hr.attendance.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.attendance.fields.employee_number", "Employee No.")),
      column.date("work_date", resourceLabel("hr.attendance.fields.work_date", "Work Date")),
      column.text("shift_name", resourceLabel("hr.attendance.fields.shift", "Shift")),
      column.text("status_label", resourceLabel("hr.attendance.fields.status", "Attendance Status")),
      column.text("source_label", resourceLabel("hr.attendance.fields.source", "Source")),
      column.text("approval_status", resourceLabel("hr.attendance.fields.approval_status", "Approval Status")),
      column.datetime("check_in", resourceLabel("hr.attendance.fields.check_in", "Check In")),
      column.datetime("check_out", resourceLabel("hr.attendance.fields.check_out", "Check Out")),
      column.number("worked_minutes", resourceLabel("hr.attendance.fields.worked_minutes", "Worked Minutes")),
      column.number("late_minutes", resourceLabel("hr.attendance.fields.late_minutes", "Late Minutes")),
      column.number("overtime_minutes", resourceLabel("hr.attendance.fields.overtime_minutes", "Overtime Minutes")),
      column.text("excused_late_minutes", resourceLabel("hr.attendance.fields.excused_late_minutes", "Excused Late (min)")),
      column.text("permission_state_label", resourceLabel("hr.attendance.fields.permission_state", "Permission")),
      column.text("reviewed_by_name", resourceLabel("hr.attendance.fields.reviewed_by", "Reviewed by")),
      column.status("is_geofence_valid", resourceLabel("hr.attendance.fields.is_geofence_valid", "Geofence Valid")),
      column.status("is_manual_adjustment", resourceLabel("hr.attendance.fields.is_manual_adjustment", "Manual Adjustment")),
      column.datetime("approved_at", resourceLabel("hr.attendance.fields.approved_at", "Approved at")),
      column.text("approved_by_name", resourceLabel("hr.attendance.fields.approved_by", "Approved by")),
      column.text("leave_required_effective", resourceLabel("hr.attendance.fields.leave_required_effective", "Leave Required")),
      column.text("leave_obligation_label", resourceLabel("hr.attendance.fields.leave_obligation_label", "Obligation")),
      column.text("unauthorized_late_minutes", resourceLabel("hr.attendance.fields.unauthorized_late_minutes", "Unauthorized Late (min)")),

    ],
  })
}