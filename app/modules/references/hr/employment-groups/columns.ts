import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { EmploymentGroupsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmploymentGroupsRow) => void
  onDelete?: (row: EmploymentGroupsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmploymentGroupsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmploymentGroupsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmploymentGroupsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.employment-groups.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.employment-groups.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.employment-groups.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.employment-groups.fields.sort_order", "Sort order")),
    ],
  })
}