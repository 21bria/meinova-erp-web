import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { RotationPurposesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: RotationPurposesRow) => void
  onDelete?: (row: RotationPurposesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getRotationPurposesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<RotationPurposesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<RotationPurposesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.rotation-purposes.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.rotation-purposes.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.rotation-purposes.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.rotation-purposes.fields.sort_order", "Sort order")),
      column.status("deducts_leave", resourceLabel("references.hr.rotation-purposes.fields.deducts_leave", "Deducts Leave")),
      column.text("leave_type_name", resourceLabel("references.hr.rotation-purposes.fields.leave_type", "Leave Type")),
    ],
  })
}