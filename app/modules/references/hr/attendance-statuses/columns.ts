import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { AttendanceStatusesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: AttendanceStatusesRow) => void
  onDelete?: (row: AttendanceStatusesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getAttendanceStatusesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<AttendanceStatusesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<AttendanceStatusesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.attendance-statuses.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.attendance-statuses.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.attendance-statuses.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.attendance-statuses.fields.sort_order", "Sort order")),
    ],
  })
}