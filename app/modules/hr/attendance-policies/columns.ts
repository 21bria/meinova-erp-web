import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AttendancePoliciesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AttendancePoliciesRow) => void
  onDelete?: (row: AttendancePoliciesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAttendancePoliciesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AttendancePoliciesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AttendancePoliciesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("company_name", resourceLabel("hr.attendance-policies.fields.company", "Company")),
      column.text("location_name", resourceLabel("hr.attendance-policies.fields.location", "Location")),
      column.text("employee_group_name", resourceLabel("hr.attendance-policies.fields.employee_group", "Employee Group")),
      column.text("code", resourceLabel("hr.attendance-policies.fields.code", "Code")),
      column.text("name", resourceLabel("hr.attendance-policies.fields.name", "Name")),
      column.text("late_tolerance_minutes", resourceLabel("hr.attendance-policies.fields.late_tolerance_minutes", "Late Tolerance (minutes)")),
      column.text("early_leave_tolerance_minutes", resourceLabel("hr.attendance-policies.fields.early_leave_tolerance_minutes", "Early Leave Tolerance (minutes)")),
      column.text("late_leave_threshold_minutes", resourceLabel("hr.attendance-policies.fields.late_leave_threshold_minutes", "Late → Leave Threshold (minutes)")),
      column.text("leave_deduction_days", resourceLabel("hr.attendance-policies.fields.leave_deduction_days", "Leave Deduction (days)")),
      column.text("leave_type_name", resourceLabel("hr.attendance-policies.fields.leave_type", "Leave type")),
      column.status("require_supervisor_review", resourceLabel("hr.attendance-policies.fields.require_supervisor_review", "Require supervisor review")),
      column.status("notify_employee", resourceLabel("hr.attendance-policies.fields.notify_employee", "Notify employee")),
      column.status("notify_supervisor", resourceLabel("hr.attendance-policies.fields.notify_supervisor", "Notify supervisor")),
      column.status("notify_hr", resourceLabel("hr.attendance-policies.fields.notify_hr", "Notify hr")),
      column.text("overtime_threshold_minutes", resourceLabel("hr.attendance-policies.fields.overtime_threshold_minutes", "Overtime Threshold (minutes)")),
      column.status("is_active", resourceLabel("hr.attendance-policies.fields.is_active", "Active")),
      column.text("scope_label", resourceLabel("hr.attendance-policies.fields.scope_label", "Applies To")),
      column.text("specificity", resourceLabel("hr.attendance-policies.fields.specificity", "Priority")),
    ],
  })
}