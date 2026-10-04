import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { FacilityTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: FacilityTypesRow) => void
  onDelete?: (row: FacilityTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getFacilityTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<FacilityTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<FacilityTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.organization.facility-types.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.organization.facility-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.organization.facility-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.organization.facility-types.fields.sort_order", "Sort Order")),
    ],
  })
}