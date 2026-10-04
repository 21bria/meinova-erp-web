import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { MaritalStatusesRow } from "./types"

type ColumnActions = {
  onEdit?: (row: MaritalStatusesRow) => void
  onDelete?: (row: MaritalStatusesRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getMaritalStatusesColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<MaritalStatusesRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<MaritalStatusesRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.marital-statuses.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.marital-statuses.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.marital-statuses.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.marital-statuses.fields.sort_order", "Sort order")),
    ],
  })
}