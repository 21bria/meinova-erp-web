import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { BranchRow } from "./types"

type ColumnActions = {
  onEdit?: (row: BranchRow) => void
  onDelete?: (row: BranchRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getBranchColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<BranchRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<BranchRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("administration.organization.branch.fields.is_active", "Active")),
      column.text("company_name", resourceLabel("administration.organization.branch.fields.company", "Company")),
      column.text("code", resourceLabel("administration.organization.branch.fields.code", "Branch Code")),
      column.text("name", resourceLabel("administration.organization.branch.fields.name", "Branch Name")),
      column.text("country_name", resourceLabel("administration.organization.branch.fields.country", "Country")),
      column.text("province_name", resourceLabel("administration.organization.branch.fields.province", "Province")),
      column.text("city_name", resourceLabel("administration.organization.branch.fields.city", "City")),
      column.text("postal_code", resourceLabel("administration.organization.branch.fields.postal_code", "Postal code")),
      column.text("phone", resourceLabel("administration.organization.branch.fields.phone", "Phone")),
      column.text("email", resourceLabel("administration.organization.branch.fields.email", "Email")),
      column.text("website", resourceLabel("administration.organization.branch.fields.website", "Website")),
    ],
  })
}