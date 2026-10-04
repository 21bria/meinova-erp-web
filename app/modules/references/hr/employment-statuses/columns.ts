import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { EmploymentStatusesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: EmploymentStatusesRow) => void
  onDelete?: (row: EmploymentStatusesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getEmploymentStatusesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<EmploymentStatusesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<EmploymentStatusesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.employment-statuses.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.employment-statuses.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.employment-statuses.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.employment-statuses.fields.sort_order", "Sort order")),
    ],
  })
}