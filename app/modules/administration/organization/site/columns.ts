import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { SiteRow } from "./types"

type ColumnActions = {
  onEdit?: (row: SiteRow) => void
  onDelete?: (row: SiteRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getSiteColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<SiteRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<SiteRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("company_name", "Company"),
      column.text("branch_name", "Branch"),
      column.text("code", "Site Code"),
      column.text("name", "Site Name"),
      column.text("site_type_name", "Site Type"),
      column.text("country_name", "Country"),
      column.text("province_name", "Province"),
      column.text("city_name", "City"),
      column.text("postal_code", "Postal code"),
      column.text("company_name", "Company name"),
      column.text("branch_name", "Branch name"),
      column.text("site_type_name", "Site type name"),
      column.text("country_name", "Country name"),
      column.text("province_name", "Province name"),
      column.text("city_name", "City name"),
    ],
  })
}