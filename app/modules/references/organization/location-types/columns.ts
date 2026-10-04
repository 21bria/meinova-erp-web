import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LocationTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LocationTypesRow) => void
  onDelete?: (row: LocationTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLocationTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LocationTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LocationTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.organization.location-types.fields.is_active", "Is active")),
      column.text("code", resourceLabel("references.organization.location-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.organization.location-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.organization.location-types.fields.sort_order", "Sort order")),
    ],
  })
}