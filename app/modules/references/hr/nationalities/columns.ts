import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { NationalitiesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: NationalitiesRow) => void
  onDelete?: (row: NationalitiesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getNationalitiesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<NationalitiesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<NationalitiesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.nationalities.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.nationalities.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.nationalities.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.nationalities.fields.sort_order", "Sort order")),
    ],
  })
}