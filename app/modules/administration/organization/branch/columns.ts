import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

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
      column.status("is_active", "Active"),
      column.text("company_name", "Company"),
      column.text("code", "Branch Code"),
      column.text("name", "Branch Name"),
      column.text("country_name", "Country"),
      column.text("province_name", "Province"),
      column.text("city_name", "City"),
      column.text("postal_code", "Postal code"),
      column.text("phone", "Phone"),
      column.text("email", "Email"),
      column.text("website", "Website"),
      column.text("company_name", "Company name"),
    ],
  })
}