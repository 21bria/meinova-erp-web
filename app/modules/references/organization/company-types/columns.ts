import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CompanyTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CompanyTypesRow) => void
  onDelete?: (row: CompanyTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCompanyTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CompanyTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CompanyTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.organization.company-types.fields.is_active", "Is active")),
      column.text("code", resourceLabel("references.organization.company-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.organization.company-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.organization.company-types.fields.sort_order", "Sort order")),
    ],
  })
}