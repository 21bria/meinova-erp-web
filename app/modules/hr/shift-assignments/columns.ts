import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ShiftAssignmentsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ShiftAssignmentsRow) => void
  onDelete?: (row: ShiftAssignmentsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getShiftAssignmentsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ShiftAssignmentsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ShiftAssignmentsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.text("employee_name", resourceLabel("hr.shift-assignments.fields.employee", "Employee")),
      column.text("employee_number", resourceLabel("hr.shift-assignments.fields.employee_number", "Employee No.")),
      column.text("shift_name", resourceLabel("hr.shift-assignments.fields.shift", "Shift")),
      column.text("kind_label", resourceLabel("hr.shift-assignments.fields.kind", "Kind")),
      column.text("layer_label", resourceLabel("hr.shift-assignments.fields.layer", "Layer")),
      column.date("start_date", resourceLabel("hr.shift-assignments.fields.start_date", "Start Date")),
      column.date("end_date", resourceLabel("hr.shift-assignments.fields.end_date", "End Date")),
      column.text("reason", resourceLabel("hr.shift-assignments.fields.reason", "Reason")),
      column.text("shift_start_time", resourceLabel("hr.shift-assignments.fields.shift_start_time", "Start")),
      column.text("shift_end_time", resourceLabel("hr.shift-assignments.fields.shift_end_time", "End")),
      column.number("day_count", resourceLabel("hr.shift-assignments.fields.day_count", "Days")),
    ],
  })
}