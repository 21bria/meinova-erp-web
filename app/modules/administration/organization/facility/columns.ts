import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { FacilityRow } from "./types"

type ColumnActions = {
  onEdit?: (row: FacilityRow) => void
  onDelete?: (row: FacilityRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getFacilityColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<FacilityRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<FacilityRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.organization.facility.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("administration.organization.facility.fields.company", "Company")),
      column.text("branch_name", resourceLabel("administration.organization.facility.fields.branch", "Branch")),
      column.text("location_name", resourceLabel("administration.organization.facility.fields.location", "Location")),
      column.text("facility_type_name", resourceLabel("administration.organization.facility.fields.facility_type", "Facility Type")),
      column.text("code", resourceLabel("administration.organization.facility.fields.code", "Facility Code")),
      column.text("name", resourceLabel("administration.organization.facility.fields.name", "Facility Name")),
    ],
  })
}