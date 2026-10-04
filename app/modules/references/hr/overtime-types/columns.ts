import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { OvertimeTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: OvertimeTypesRow) => void
  onDelete?: (row: OvertimeTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getOvertimeTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<OvertimeTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<OvertimeTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.overtime-types.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.overtime-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.overtime-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.overtime-types.fields.sort_order", "Sort order")),
    ],
  })
}