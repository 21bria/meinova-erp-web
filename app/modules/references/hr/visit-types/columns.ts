import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { VisitTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: VisitTypesRow) => void
  onDelete?: (row: VisitTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getVisitTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<VisitTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<VisitTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.visit-types.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.visit-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.visit-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.visit-types.fields.sort_order", "Sort order")),
    ],
  })
}