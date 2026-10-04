import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { DegreesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DegreesRow) => void
  onDelete?: (row: DegreesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDegreesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DegreesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DegreesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.degrees.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.degrees.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.degrees.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.degrees.fields.sort_order", "Sort order")),
    ],
  })
}