import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

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
      column.status("is_active", resourceLabel("administration.organization.company.fields.is_active", "Active")),
      column.text("parent_name", resourceLabel("administration.organization.company.fields.parent", "Parent Company")),
      column.text("company_type_name", resourceLabel("administration.organization.company.fields.company_type", "Company Type")),
      column.text("code", resourceLabel("administration.organization.company.fields.code", "Company Code")),
      column.text("name", resourceLabel("administration.organization.company.fields.name", "Company Name")),
      column.text("legal_name", resourceLabel("administration.organization.company.fields.legal_name", "Legal Name")),
      column.text("tax_number", resourceLabel("administration.organization.company.fields.tax_number", "Tax Number")),
      column.text("country_name", resourceLabel("administration.organization.company.fields.country", "Country")),
      column.text("province_name", resourceLabel("administration.organization.company.fields.province", "Province")),
      column.text("city_name", resourceLabel("administration.organization.company.fields.city", "City")),
      column.text("postal_code", resourceLabel("administration.organization.company.fields.postal_code", "Postal code")),
      column.text("phone", resourceLabel("administration.organization.company.fields.phone", "Phone")),
      column.text("email", resourceLabel("administration.organization.company.fields.email", "Email")),
      column.text("website", resourceLabel("administration.organization.company.fields.website", "Website")),
    ],
  })
}