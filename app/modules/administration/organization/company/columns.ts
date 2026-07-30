import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns } from "@framework"

import type { CompanyRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CompanyRow) => void
  onDelete?: (row: CompanyRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCompanyColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CompanyRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CompanyRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", "Active"),
      column.text("parent_name", "Parent Company"),
      column.text("company_type_name", "Company Type"),
      column.text("code", "Company Code"),
      column.text("name", "Company Name"),
      column.text("legal_name", "Legal Name"),
      column.text("tax_number", "Tax Number"),
      column.text("country_name", "Country"),
      column.text("province_name", "Province"),
      column.text("city_name", "City"),
      column.text("postal_code", "Postal code"),
      column.text("phone", "Phone"),
      column.text("email", "Email"),
      column.text("website", "Website"),
    ],
  })
}