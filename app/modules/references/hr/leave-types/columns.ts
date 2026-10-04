import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LeaveTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LeaveTypesRow) => void
  onDelete?: (row: LeaveTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLeaveTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LeaveTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LeaveTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.leave-types.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.leave-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.leave-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.leave-types.fields.sort_order", "Sort order")),
    ],
  })
}