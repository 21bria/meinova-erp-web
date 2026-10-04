import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { LocationRow } from "./types"

type ColumnActions = {
  onEdit?: (row: LocationRow) => void
  onDelete?: (row: LocationRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getLocationColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<LocationRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<LocationRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.organization.location.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("administration.organization.location.fields.company", "Company")),
      column.text("branch_name", resourceLabel("administration.organization.location.fields.branch", "Branch")),
      column.text("code", resourceLabel("administration.organization.location.fields.code", "Location Code")),
      column.text("name", resourceLabel("administration.organization.location.fields.name", "Location Name")),
      column.text("location_type_name", resourceLabel("administration.organization.location.fields.location_type", "Location Type")),
      column.text("country_name", resourceLabel("administration.organization.location.fields.country", "Country")),
      column.text("province_name", resourceLabel("administration.organization.location.fields.province", "Province")),
      column.text("city_name", resourceLabel("administration.organization.location.fields.city", "City")),
      column.text("postal_code", resourceLabel("administration.organization.location.fields.postal_code", "Postal code")),
    ],
  })
}