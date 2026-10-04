import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LeaveReasonsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LeaveReasonsRow) => void
  onDelete?: (row: LeaveReasonsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLeaveReasonsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LeaveReasonsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LeaveReasonsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.leave-reasons.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.leave-reasons.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.leave-reasons.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.leave-reasons.fields.sort_order", "Sort order")),
    ],
  })
}