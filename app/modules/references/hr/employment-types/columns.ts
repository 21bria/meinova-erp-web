import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { EmploymentTypesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmploymentTypesRow) => void
  onDelete?: (row: EmploymentTypesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmploymentTypesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmploymentTypesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmploymentTypesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.employment-types.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.employment-types.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.employment-types.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.employment-types.fields.sort_order", "Sort order")),
      column.status("requires_contract", resourceLabel("references.hr.employment-types.fields.requires_contract", "Requires contract")),
    ],
  })
}