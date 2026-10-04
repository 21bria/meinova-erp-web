import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { GendersRow } from "./types"

type ColumnActions = {
  onEdit?: (row: GendersRow) => void
  onDelete?: (row: GendersRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getGendersColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<GendersRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<GendersRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.genders.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.genders.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.genders.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.genders.fields.sort_order", "Sort order")),
    ],
  })
}