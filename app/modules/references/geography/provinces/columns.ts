import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { ProvincesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: ProvincesRow) => void
  onDelete?: (row: ProvincesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getProvincesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<ProvincesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<ProvincesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.geography.provinces.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.geography.provinces.fields.code", "Code")),
      column.text("name", resourceLabel("references.geography.provinces.fields.name", "Name")),
      column.text("aid", resourceLabel("references.geography.provinces.fields.aid", "Area ID")),
      column.text("country_name", resourceLabel("references.geography.provinces.fields.country", "Country")),
    ],
  })
}