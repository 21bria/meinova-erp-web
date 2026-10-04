import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { CategoriesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: CategoriesRow) => void
  onDelete?: (row: CategoriesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getCategoriesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<CategoriesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<CategoriesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("assets.categories.fields.is_active", "Active")),
      column.text("code", resourceLabel("assets.categories.fields.code", "Code")),
      column.text("name", resourceLabel("assets.categories.fields.name", "Name")),
      column.text("sort_order", resourceLabel("assets.categories.fields.sort_order", "Sort Order")),
      column.status("requires_serial_number", resourceLabel("assets.categories.fields.requires_serial_number", "Requires Serial Number")),
      column.status("allow_employee_custody", resourceLabel("assets.categories.fields.allow_employee_custody", "Employee Custody")),
      column.status("allow_organization_custody", resourceLabel("assets.categories.fields.allow_organization_custody", "Organization Custody")),
    ],
  })
}