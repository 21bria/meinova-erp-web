import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CitiesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CitiesRow) => void
  onDelete?: (row: CitiesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCitiesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CitiesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CitiesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.geography.cities.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.geography.cities.fields.code", "Code")),
      column.text("name", resourceLabel("references.geography.cities.fields.name", "Name")),
      column.text("aid", resourceLabel("references.geography.cities.fields.aid", "Area ID")),
      column.text("province_name", resourceLabel("references.geography.cities.fields.province", "Province")),
    ],
  })
}