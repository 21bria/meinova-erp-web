import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { DistrictsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: DistrictsRow) => void
  onDelete?: (row: DistrictsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getDistrictsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<DistrictsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<DistrictsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.geography.districts.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.geography.districts.fields.code", "Code")),
      column.text("name", resourceLabel("references.geography.districts.fields.name", "Name")),
      column.text("aid", resourceLabel("references.geography.districts.fields.aid", "Area ID")),
      column.text("city_name", resourceLabel("references.geography.districts.fields.city", "Kabupaten/Kota")),
    ],
  })
}