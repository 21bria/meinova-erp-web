import type { ColumnDef } from "@tanstack/vue-table"
import type { UserRole } from "@/utils/roles"
import { column, createColumns, resourceLabel } from "@framework"

import type { PerformanceRatingsRow } from "./types"

type ColumnActions = {
  onEdit?: (row: PerformanceRatingsRow) => void
  onDelete?: (row: PerformanceRatingsRow) => void
}

type ColumnOptions = {
  role?: UserRole
}

export function getPerformanceRatingsColumns(
  actions: ColumnActions = {},
  opts: ColumnOptions = {},
): ColumnDef<PerformanceRatingsRow>[] {
  const role = opts.role ?? "SITE_USER"

  const canMutateByRole =
    role !== "GLOBAL_VIEWER"
    && role !== "VIEWER"

  const canMutate =
    canMutateByRole
    && Boolean(actions.onEdit || actions.onDelete)

  return createColumns<PerformanceRatingsRow>({
    selectable: canMutate,
    canMutate,
    actions,
    items: [
      column.status("is_active", resourceLabel("references.hr.performance-ratings.fields.is_active", "Active")),
      column.text("code", resourceLabel("references.hr.performance-ratings.fields.code", "Code")),
      column.text("name", resourceLabel("references.hr.performance-ratings.fields.name", "Name")),
      column.text("sort_order", resourceLabel("references.hr.performance-ratings.fields.sort_order", "Sort order")),
    ],
  })
}